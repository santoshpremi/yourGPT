import { CropSquare, Send } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Divider, IconButton, Textarea } from "@mui/joy";
import { motion } from "framer-motion";
import type { ComponentProps, PropsWithChildren } from "react";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type {
  Chat,
  ModelOverride,
} from "../../../../backend/src/api/chat/chatTypes.ts";
import type { KnowledgeCollection } from "../../../../backend/src/api/rag/dataPool/dataPoolTypes.ts";
import { useUploadDocumentWithToast } from "../../../lib/api/documents.js";
import { trpc } from "../../../lib/api/trpc/trpc.ts";
import { allowedMimeTypesForAdiDocuments } from "../../../../backend/src/constants/mime.ts";
import { useTranslation } from "../../../../src/lib/i18n";
import { NewSourceChip, SourceChip } from "./sources/SourceChip.tsx";
import { isSpecificLLM } from "../../util/llm.ts";
import { WarningMessage } from "./WarningMessage.tsx";
import ChatSourceContainer, {
  type RagModeInput,
} from "./sources/ChatSourceContainer.tsx";
import { DocumentChip } from "./sources/DocumentChip.tsx";
import { CHAT_INPUT_ID } from "../../../lib/testIds.ts";

export interface AttachedDocument {
  id: string;
  tokens: number;
}

interface ChatInputProps extends ComponentProps<typeof Textarea> {
  postMessage: ({
    content,
    attachmentIds,
    ragMode,
  }: {
    content: string;
    attachmentIds: string[];
    ragMode: RagModeInput;
  }) => void;
  onCancel?: () => void;
  setModelOverride?: (model: ModelOverride) => void;
  isGenerating?: boolean;
  showAttachmentButton?: boolean;
  startDecorator?: React.ReactNode;
  allowDocumentUpload?: boolean;
  embedded?: boolean;
  value?: string;
  setValue?: (value: string) => void;
  model?: ModelOverride | null;
  chatTokens?: number;
  chat?: Chat;
}

export type SelectableKnowledgeCollections = (KnowledgeCollection & {
  isNew: boolean;
})[];

export const ChatInput = React.forwardRef(
  (
    {
      postMessage,
      startDecorator,
      disabled,
      onCancel,
      isGenerating,
      allowDocumentUpload = true,
      showAttachmentButton = true,
      embedded = false,
      value,
      setValue,
      model,
      setModelOverride,
      chatTokens,
      chat,
      ...textAreaProps
    }: ChatInputProps,
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    const [ragMode, setRagMode] = useState<RagModeInput>({
      mode: chat?.ragMode ?? "OFF",
      customSourceId: chat?.customSourceId ?? undefined,
    });
    const [sources, setSources] = useState<SelectableKnowledgeCollections>([]);
    const [_input, _setInput] = useState("");
    const [numLoadingAttachments, setNumLoadingAttachments] = useState(0);
    const [sourceExpanded, setSourceExpanded] = useState(false);
    const [messageCreditWarningAccepted, setMessageCreditWarningAccepted] =
      useState(false);
    const [attachedDocuments, setAttachedDocuments] = useState<
      AttachedDocument[]
    >([]);

    const { data: productConfig } = trpc.productConfig.get.useQuery();
    const { data: documentIntelligenceEnabled } =
      trpc.tools.documentIntelligence.isEnabled.useQuery();
    const organization = trpc.organization.getOrganization.useQuery().data;
    const { data: knowledgeCollections } = trpc.rag.dataPools.getAll.useQuery();

    const { mutateAsync: updateRagMode } = trpc.chat.setRagMode.useMutation();
    const { mutateAsync: markAsSeen } =
      trpc.rag.dataPools.updateAsSeen.useMutation();

    const { t } = useTranslation();
    const uploadDocument = useUploadDocumentWithToast();

    const attachmentUploaderRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLInputElement>(null);

    const input = value ?? _input;
    const setInput = setValue ?? _setInput;

    const selectedSource = sources.find(
      ({ id }) => id === ragMode.customSourceId
    );
    const attachedDocumentIds = attachedDocuments?.map((d) => d.id) ?? [];
    const hasAttachments =
      attachedDocumentIds.length > 0 ||
      numLoadingAttachments > 0 ||
      selectedSource ||
      ragMode.mode === "AUTO";

    const newSource =
      !hasAttachments && !sourceExpanded && sources.some((s) => s.isNew);
    const isDisabled = disabled || numLoadingAttachments > 0;

    const fileUploadEnabled =
      documentIntelligenceEnabled &&
      allowDocumentUpload &&
      showAttachmentButton &&
      ragMode.mode === "OFF";

    const ragEnabled =
      !!productConfig?.enableRag &&
      attachedDocumentIds.length === 0 &&
      numLoadingAttachments === 0;

    const chosenModel = model ?? organization?.defaultModel;

    useEffect(() => {
      if (!knowledgeCollections) return;
      setSources(knowledgeCollections);
    }, [knowledgeCollections, chat, setSources]);

    const send = () => {
      if (input.replace(/\na/g, "").trim() === "") return;

      postMessage({
        content: input.trim(),
        attachmentIds: attachedDocumentIds,
        ragMode,
      });
      setSourceExpanded(false);
      setInput("");
      setAttachedDocuments([]);
      setMessageCreditWarningAccepted(false);
    };

    const toggleRagMode = async (ragInput: RagModeInput) => {
      const { mode } = ragInput;
      const { customSourceId } = ragInput;
      const prev = { ...ragMode };
      const customSource = mode === "CUSTOM" ? customSourceId : undefined;

      let newMode = {
        mode,
        customSourceId: customSource,
      };
      if (mode === prev.mode && customSourceId === prev.customSourceId) {
        newMode = { mode: "OFF", customSourceId: undefined };
      }

      setRagMode(newMode);
      if (chat?.id) {
        await updateRagMode(
          {
            chatId: chat?.id,
            customSourceId: newMode.customSourceId,
            ragMode: newMode.mode,
          },
          { onError: () => setRagMode(prev) }
        );
      }
    };

    const onAddAttachment = async () => {
      const files = attachmentUploaderRef.current?.files;
      if (!files || files.length === 0) return;

      for (const file of files) {
        setNumLoadingAttachments((prev) => prev + 1);

        try {
          const { id, tokens } = await uploadDocument(file);

          setAttachedDocuments((prev) => [...prev, { id, tokens }]);
        } catch (e) {
          console.error(e);
        } finally {
          setNumLoadingAttachments((prev) => prev - 1);
        }
      }
      // clear the input
      attachmentUploaderRef.current.value = "";
    };

    const showSourceContainer = (open: boolean) => {
      if (open && newSource) {
        void markAsSeen();
      }
      setSourceExpanded(open);
    };

    return (
      <>
        <motion.div
          initial="normal"
          animate={sourceExpanded ? "padded" : "normal"}
          variants={{ padded: { marginTop: 140 }, normal: { marginTop: 0 } }}
          className={twMerge(
            "relative flex grow items-end justify-end space-x-4",
            embedded && "gap"
          )}
          id="messageInput"
        >
          {startDecorator}
          <input
            type="file"
            name="file"
            id="attachment"
            accept={allowedMimeTypesForAdiDocuments}
            hidden
            ref={attachmentUploaderRef}
            onChange={onAddAttachment}
            multiple
          />
          <div className="flex w-full flex-col">
            {!embedded &&
              chosenModel &&
              isSpecificLLM(chosenModel) &&
              setModelOverride && (
                <WarningMessage
                  model={chosenModel}
                  setModelOverride={setModelOverride}
                  attachedDocuments={attachedDocuments}
                  input={input}
                  chatTokens={chatTokens}
                  messageCreditWarningAccepted={messageCreditWarningAccepted}
                  setMessageCreditWarningAccepted={
                    setMessageCreditWarningAccepted
                  }
                />
              )}

            <div className="relative">
              <ChatSourceContainer
                handleRagMode={toggleRagMode}
                ragMode={ragMode}
                sources={sources}
                isVisible={sourceExpanded}
                documents={attachedDocuments}
                fileUploadEnabled={!!fileUploadEnabled}
                ragEnabled={ragEnabled}
                uploadDocument={() => attachmentUploaderRef.current?.click()}
                removeDocument={(id) =>
                  setAttachedDocuments((prev) => prev.filter((d) => id != d.id))
                }
              />

              <div className="flex w-full flex-col">
                <Textarea
                  ref={textAreaRef}
                  className="z-10"
                  sx={{
                    flexDirection: hasAttachments ? "column" : "row",
                    alignItems: hasAttachments ? "start" : "center",
                  }}
                  slotProps={{
                    textarea: {
                      "data-testid": CHAT_INPUT_ID,
                      ref,
                      sx: {
                        paddingY: embedded ? "5px" : "20px",
                      },
                    },
                    startDecorator: {
                      sx: {
                        paddingX: "0px",
                        margin: "0px",
                        marginRight: "10px",
                        height: "100%",
                      },
                    },
                  }}
                  placeholder={t("composeMessage")}
                  autoFocus
                  maxRows={18}
                  minRows={1}
                  onKeyDown={(e) => {
                    // submit the form on control+enter
                    if (input.replace(/\na/g, "").trim() === "") return;

                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isDisabled) send();
                    }
                  }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  {...textAreaProps}
                  startDecorator={
                    <div className="mt-1 flex flex-row flex-wrap items-center gap-2">
                      {!!(fileUploadEnabled || productConfig?.enableRag) && (
                        <>
                          <div>
                            {newSource && (
                              <NewSourceChip
                                className="-translate-x-[41%] -translate-y-9"
                                onClick={() => showSourceContainer(true)}
                              />
                            )}
                            <SourceToggle
                              expanded={sourceExpanded}
                              setExpanded={showSourceContainer}
                            />
                          </div>

                          {!hasAttachments && (
                            <Divider orientation="vertical" />
                          )}
                        </>
                      )}
                      <>
                        {attachedDocumentIds?.map((id) => (
                          <DocumentChip
                            documentId={id}
                            key={id}
                            onRemove={() => {
                              setAttachedDocuments(
                                attachedDocuments.filter((d) => d.id !== id)
                              );
                            }}
                          />
                        ))}
                        {numLoadingAttachments > 0 &&
                          new Array(numLoadingAttachments)
                            .fill({})
                            .map((_, i) => <DocumentChip key={i} loading />)}
                        {selectedSource && (
                          <SourceChip
                            text={selectedSource.name}
                            onDelete={async () => {
                              await toggleRagMode({ mode: "OFF" });
                            }}
                          />
                        )}
                        {ragMode.mode === "AUTO" && (
                          <SourceChip
                            text={t("knowledgeBase.automaticSource")}
                            onDelete={async () =>
                              await toggleRagMode({ mode: "OFF" })
                            }
                          />
                        )}
                      </>
                    </div>
                  }
                ></Textarea>
              </div>
            </div>
          </div>

          {isGenerating && !!onCancel ? (
            <Button
              onClick={onCancel}
              variant="outlined"
              className="self-center"
            >
              <div className="flex flex-row items-center gap-2">
                <CropSquare fontSize="small" />
                {input.length > 0 ? t("resend") : t("cancel")}
              </div>
            </Button>
          ) : (
            <Button
              className="mb-5 flex flex-row items-center gap-2 self-center"
              data-testid="submit-message-button"
              onClick={send}
              disabled={isDisabled}
            >
              {!embedded && t("sendMessage")}
              <Send fontSize="small" />
            </Button>
          )}
        </motion.div>
      </>
    );
  }
);

ChatInput.displayName = "ChatInput";

function SourceToggle({
  expanded,
  setExpanded,
}: PropsWithChildren<{
  expanded: boolean;
  setExpanded: (e: boolean) => void;
}>) {
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="inline-flex items-center">
      <IconButton onClick={toggleExpand}>
        <AddIcon
          style={{
            transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: expanded ? "rotate(135deg)" : "",
          }}
        />
      </IconButton>
    </div>
  );
}
