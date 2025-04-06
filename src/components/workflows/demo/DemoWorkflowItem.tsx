import { PlayCircle } from "@mui/icons-material";
import { useState } from "react";
import { DEMO_WORKFLOW } from "./DEMO_WORKFLOW";
import { trpc } from "../../../lib/api/trpc/trpc";
import { useNavigate, useParams } from "../../../router";
import { useQueuedMessagesStore } from "../../../lib/context/queuedMessagesStore";
import { toast } from "react-toastify";
import { replaceAll } from "../../util/polyfill";
import { useTranslation } from "../../../lib/i18n";
import { useGuide } from "../../onboarding/useGuide";
import type { WorkflowStep } from "../../../../backend/src/api/workflow/workflowTypes";
import { LeafItem } from "../../sidebar/tree/LeafItem";
import { RunWorkflowModal } from "../../sidebar/workflows/RunWorkflowModal";

export function DemoWorkflowItem() {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutateAsync: createChat } = trpc.chat.create.useMutation();
  const utils = trpc.useUtils();
  const navigate = useNavigate();
  const params = useParams("/:organizationId/workflows/:workflowId");
  const clearMessageQueue = useQueuedMessagesStore((s) => s.clear);
  const enqueueMessage = useQueuedMessagesStore((s) => s.addQueuedMessage);
  const { t } = useTranslation();

  const { setCompleted } = useGuide();

  const onClick = () => {
    setModalOpen(true);
  };
  const onInit = async (values: Record<string, string>) => {
    setModalOpen(false);

    const chat = await createChat({
      name: DEMO_WORKFLOW.name,
    });

    void utils.chat.invalidate();

    void navigate("/:organizationId/chats/:chatId", {
      params: {
        organizationId: params.organizationId,
        chatId: chat.id,
      },
    });

    clearMessageQueue();
    DEMO_WORKFLOW.steps.forEach((step: WorkflowStep) => {
      let { promptTemplate: content } = step;

      if (content.length > 0) {
        for (const input of DEMO_WORKFLOW.inputs ?? []) {
          content = replaceAll(content, `{{${input.key}}}`, values[input.key]);
        }
        enqueueMessage({
          content,
          chatId: chat.id,
        });
      }
    });
    setCompleted(true);
    toast.success(t("workflowExecuted"));
  };
  return (
    <>
      <LeafItem
        isSelected={false}
        icon={<PlayCircle fontSize="small" />}
        name="Demo Workflow"
        onClick={onClick}
        isDemo
      />
      <RunWorkflowModal
        workflow={DEMO_WORKFLOW}
        open={modalOpen}
        setOpen={setModalOpen}
        onSubmit={onInit}
      />
    </>
  );
}
