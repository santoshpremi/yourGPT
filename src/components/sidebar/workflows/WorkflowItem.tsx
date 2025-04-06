import { PlayCircleOutline } from "@mui/icons-material";
import { skipToken } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { type WorkflowStep } from "../../../../backend/src/api/workflow/workflowTypes";
import { trpc } from "../../../lib/api/trpc/trpc";
import { useQueuedMessagesStore } from "../../../lib/context/queuedMessagesStore";
import { handleGenericError } from "../../../lib/errorHandling";
import { useTranslation } from "../../../lib/i18n";
import { useNavigate, useParams } from "../../../router";
import { replaceAll } from "../../util/polyfill";
import { RunWorkflowModal } from "./RunWorkflowModal.tsx";
import { type ModelOverride } from "../../../../backend/src/api/chat/chatTypes.ts";
import { LeafItemDropdown } from "../tree/LeafItemDropdown.tsx";
import { LeafItem } from "../tree/LeafItem.tsx";
import { ConfirmModal } from "../tree/ConfirmModal.tsx";

export function WorkflowItem({
  workflowId,
  onAction,
  isFavorite,
}: {
  workflowId: string;
  onAction?: () => void;
  isFavorite?: boolean;
}) {
  const { t } = useTranslation();
  const utils = trpc.useUtils();
  const navigate = useNavigate();
  const params = useParams("/:organizationId/workflows/:workflowId");

  const { data: workflow } = trpc.workflows.getById.useQuery({
    workflow: { id: workflowId },
  });
  const { data: department } = trpc.organization.department.byId.useQuery(
    workflow?.departmentId
      ? {
          departmentId: workflow?.departmentId,
        }
      : skipToken
  );

  const { mutateAsync: deleteWorkflow } = trpc.workflows.delete.useMutation();
  const { mutateAsync: createChat } = trpc.chat.create.useMutation();
  const { mutateAsync: toggleFavorite } =
    trpc.workflows.toggleFavorite.useMutation();

  const isSelected = params.workflowId === workflowId;

  const onDelete = async () => {
    await deleteWorkflow({
      workflow: { id: workflowId },
    });
    await utils.organization.department.invalidate();
    await utils.workflows.invalidate();

    toast.success(t("workflowDeleted"));

    if (params?.workflowId === workflowId) {
      void navigate("/:organizationId", { params });
    }
  };

  const { data: documentIntelligenceEnabled } =
    trpc.tools.documentIntelligence.isEnabled.useQuery();

  const hasInputs =
    (workflow?.inputs?.length ?? 0) > 0 ||
    (workflow?.allowDocumentUpload && documentIntelligenceEnabled);

  const [modalOpen, setModalOpen] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { mutateAsync: trackUsage } =
    trpc.workflows.trackWorkflowExecution.useMutation();
  const enqueueMessage = useQueuedMessagesStore((s) => s.addQueuedMessage);
  const clearMessageQueue = useQueuedMessagesStore((s) => s.clear);

  if (!workflow) return;

  const hasSteps = workflow.steps.length > 0;

  const onInit = async (
    values: Record<string, string>,
    attachmentIds: string[]
  ) => {
    setModalOpen(false);

    attachmentIds = [
      ...new Set([
        ...attachmentIds,
        ...(workflow.includedDocuments ?? []).map((doc) => doc.id),
      ]),
    ];

    const chat = await createChat({
      name: workflow.name,
      modelOverride: workflow.modelOverride,
    });

    void utils.chat.invalidate();

    const { workflowExecutionId } = await trackUsage({
      workflow: { id: workflowId },
    }).catch((error) => {
      console.error(error);
      return { workflowExecutionId: undefined };
    });

    console.log(params.organizationId);
    console.log(chat.id);
    void navigate("/:organizationId/chats/:chatId", {
      params: {
        organizationId: params.organizationId,
        chatId: chat.id,
      },
    });

    let modelOverride: ModelOverride | undefined | null;
    if (hasSteps) {
      clearMessageQueue();
      workflow.steps.forEach((step: WorkflowStep, index: number) => {
        let { promptTemplate: content } = step;
        modelOverride = step.modelOverride;

        // Idea: replace with handlebars
        if (content.length > 0) {
          for (const input of workflow.inputs ?? []) {
            content = replaceAll(
              content,
              `{{${input.key}}}`,
              values[input.key]
            );
          }
          enqueueMessage({
            content,
            chatId: chat.id,
            attachmentIds: index === 0 ? attachmentIds : undefined,
            modelOverride:
              modelOverride ?? workflow.modelOverride ?? "gpt-4o-mini",
            // existence of outputFormat without workflowExecutionId tells the server to inject additional prompt for workflow output document creation
            outputFormat:
              index === workflow.steps.length - 1
                ? workflow.outputFormat
                : undefined,
          });
        }
      });
      if (workflow.outputFormat) {
        enqueueMessage({
          content: " ",
          chatId: chat.id,
          modelOverride:
            modelOverride ?? workflow.modelOverride ?? "gpt-4o-mini",
          // existence of both outputFormat and workflowExecutionId tells the server to use the last message to create a workflow output document
          outputFormat: workflow.outputFormat,
          workflowExecutionId,
        });
      }
    }
    toast.success(t("workflowExecuted"));
    onAction?.();
  };

  const onClick = () => {
    if (hasInputs) {
      setModalOpen(true);
    } else {
      onInit({}, []).catch(console.error);
    }
  };

  return (
    <>
      <LeafItem
        isSelected={isSelected}
        icon={
          <PlayCircleOutline
            sx={{ fontSize: "1.2rem", ml: 3.2 }}
            color={isSelected ? "primary" : undefined}
          />
        }
        name={workflow.name}
        onClick={onClick}
        singleLine={true}
        endDecorator={
          <div onClick={(e) => e.stopPropagation()} className="h-[22px]">
            <LeafItemDropdown
              onEdit={
                department?.writePermission
                  ? () => {
                      onAction?.();
                      void navigate("/:organizationId/workflows/:workflowId", {
                        params: {
                          organizationId: params.organizationId,
                          workflowId: workflowId,
                        },
                      });
                    }
                  : undefined
              }
              onToggleFavorite={async () => {
                await toggleFavorite({
                  workflow: { id: workflowId },
                })
                  .then(() => utils.workflows.favorites.invalidate())
                  .catch((e: Error) => handleGenericError(e, undefined));
              }}
              onDelete={
                department?.writePermission
                  ? () => {
                      setConfirmModalOpen(true);
                    }
                  : undefined
              }
              isFavorite={isFavorite}
            ></LeafItemDropdown>
          </div>
        }
      />
      {hasInputs && hasSteps && (
        <RunWorkflowModal
          workflow={workflow}
          open={modalOpen}
          setOpen={setModalOpen}
          onSubmit={onInit}
        />
      )}
      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onSure={onDelete}
      />
    </>
  );
}
