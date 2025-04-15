import { AccordionGroup, Typography } from "@mui/joy";
import Fuse from "fuse.js";
import { useMemo } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { DelayedLoader } from "../util/DelayedLoader";
import { WorkflowsTreeGroup } from "./WorkflowsTreeGroup";
import { trpc } from "../../lib/api/trpc/trpc";
import { useGuide } from "../onboarding/useGuide";
import { useTranslation } from "../../lib/i18n";
import { optimisticWorkflowReorder } from "../../lib/optimistic/reordering";
import { DemoWorkflowItem } from "./demo/DemoWorkflowItem";

export const FAVORITE_DEPARTMENT_ID = "FAVORITE_DEPARTMENT";
export const DEMO_DEPARTMENT_ID = "DEMO_DEPARTMENT";

export function WorkflowsTree({ searchValue }: { searchValue: string }) {
  const { t } = useTranslation();
  const { completed: demoFinished } = useGuide();
  const utils = trpc.useUtils();

  const { data: departments } = trpc.organization.department.all.useQuery();
  const { data: favoriteWorkflows } = trpc.workflows.favorites.useQuery();
  const { mutateAsync: toggleFavorite } =
    trpc.workflows.toggleFavorite.useMutation();

  const { mutateAsync: updateWorkflowDepartmentAndPosition } =
    trpc.workflows.updateDepartmentAndPosition.useMutation({
      onMutate: async (input) => {
        await utils.organization.department.all.cancel();

        const currentDepartments = utils.organization.department.all.getData()!;

        const updatedDepartments = optimisticWorkflowReorder(
          currentDepartments,
          input.workflow.id,
          input.sourceDepartmentId,
          input.workflow.departmentId,
          input.workflow.index,
        );

        utils.organization.department.all.setData(
          undefined,
          updatedDepartments,
        );

        return { previousDepartments: currentDepartments };
      },
      onError: (err, input, ctx) => {
        utils.organization.department.all.setData(
          undefined,
          ctx!.previousDepartments,
        );
      },
      onSettled: async () => {
        await utils.organization.department.all.invalidate();
      },
      onSuccess: async () => {
        toast.success(t("workflowMoved"));
      },
    });

  const filteredDepartments = useMemo(() => {
    if (searchValue.trim() === "") return departments;

    const departmentsWithFilteredWorkflows = departments?.map((department) => {
      const fuse = new Fuse(department.workflows, {
        keys: ["name", "description"],
      });

      const filteredWorkflows = fuse
        .search(searchValue.trim())
        .map((result) => result.item);

      return {
        ...department,
        workflows: filteredWorkflows,
      };
    });

    return departmentsWithFilteredWorkflows?.filter(
      (department) => department.workflows.length > 0,
    );
  }, [departments, searchValue]);

  if (!departments) return <DelayedLoader />;

  async function moveWorkflowToDepartment(
    workflowId: string,
    sourceDepartmentId: string,
    targetDepartmentId: string,
    index: number,
  ) {
    if (
      sourceDepartmentId === FAVORITE_DEPARTMENT_ID ||
      targetDepartmentId === FAVORITE_DEPARTMENT_ID
    ) {
      await toggleFavorite({
        workflow: { id: workflowId },
      });
      await utils.workflows.favorites.invalidate();
      toast.success(t("workflowMoved"));
    }
    if (targetDepartmentId !== FAVORITE_DEPARTMENT_ID) {
      return updateWorkflowDepartmentAndPosition({
        workflow: { id: workflowId, departmentId: targetDepartmentId, index },
        sourceDepartmentId,
      });
    }
  }

  return (
    <div id="sidebarWorkflowsSection" className="max-w-xs">
      <DragDropContext
        onDragEnd={(result) => {
          if (
            !result.destination ||
            !result.source ||
            (result.destination.droppableId === result.source.droppableId &&
              result.destination.index === result.source.index)
          )
            return;

          moveWorkflowToDepartment(
            result.draggableId,
            result.source.droppableId,
            result.destination.droppableId,
            result.destination.index,
          ).catch((e) => {
            console.error(e);
          });
        }}
      >
        <AccordionGroup disableDivider>
          {!demoFinished && (
            <WorkflowsTreeGroup
              title="Demo Workflow"
              workflows={[]}
              isMoveDisabled
              departmentId={DEMO_DEPARTMENT_ID}
              isFavorite={() => false}
            >
              <DemoWorkflowItem />
            </WorkflowsTreeGroup>
          )}
          <WorkflowsTreeGroup
            departmentId={FAVORITE_DEPARTMENT_ID}
            isFavorite={() => true}
            title={t("favorites")}
            workflows={favoriteWorkflows ?? []}
          />
          {filteredDepartments?.map((department) => (
            <WorkflowsTreeGroup
              key={department.id}
              departmentId={department.id}
              title={
                department.isPersonal ? t("personalArea") : department.name
              }
              workflows={department.workflows}
              isMoveDisabled={!department.writePermission}
              isFavorite={(workflowId) =>
                !!favoriteWorkflows?.some((wf) => wf.id === workflowId)
              }
            />
          ))}
        </AccordionGroup>
      </DragDropContext>
      {filteredDepartments?.length === 0 && (
        <div className="p-4">
          <Typography level="body-sm" fontStyle="italic">
            {t("noResults")}
          </Typography>
        </div>
      )}
    </div>
  );
}
