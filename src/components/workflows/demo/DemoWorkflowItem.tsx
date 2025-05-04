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
import { LeafItem } from "../../sidebar/tree/LeafItem";
import { RunWorkflowModal } from "../../sidebar/workflows/RunWorkflowModal";

export function DemoWorkflowItem() {
  const [modalOpen, setModalOpen] = useState(false);
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

  const onInit = async (values: Record<string, string>, documentIds: string[] = []) => {
    setModalOpen(false);

    // Use the message and chat routers to create a new chat
    const chat = {
      id: `demo-chat-${Date.now()}`,
      name: DEMO_WORKFLOW.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hidden: false,
      modelOverride: "gpt-4o-mini",
      organizationId: params.organizationId,
      customSystemPromptSuffix: null,
      ragMode: "OFF",
      customSourceId: null,
      creditWarningAccepted: false,
      artifactId: null
    };

    void utils.chat.invalidate();

    void navigate("/:organizationId/chats/:chatId", {
      params: {
        organizationId: params.organizationId,
        chatId: chat.id,
      },
    });

    clearMessageQueue();
    DEMO_WORKFLOW.steps.forEach((step) => {
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

  const workflowModalProps = {
    id: DEMO_WORKFLOW.id,
    name: DEMO_WORKFLOW.name,
    description: DEMO_WORKFLOW.description,
    inputs: DEMO_WORKFLOW.inputs?.map(input => ({
      ...input,
      type: input.type as "short_text" | "long_text" | "enum" | "toggle"
    }))
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
        workflow={workflowModalProps}
        open={modalOpen}
        setOpen={setModalOpen}
        onSubmit={onInit}
        isDemo
      />
    </>
  );
}
