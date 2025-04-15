import { Sheet } from "@mui/joy";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LLM_META } from "../../../backend/src/ai/llmMeta";

import type { ModelOverride } from "../../../backend/src/api/chat/chatTypes.ts";
import type {
  Message,
  MessageGenerationProgress,
} from "../../../backend/src/api/chat/message/messageTypes";

import { trpc } from "../../lib/api/trpc/trpc";
import { useMe } from "../../lib/api/user";
import { useQueuedMessagesStore } from "../../lib/context/queuedMessagesStore";
import { handleGenericError } from "../../lib/errorHandling";
import { useOrganizationApi } from "../../lib/hooks/useApi";
import { useTranslation } from "../../lib/i18n";
import { maxStringLength } from "../../lib/util";
import { DelayedLoader } from "../util/DelayedLoader";
import { isSpecificLLM } from "../util/llm";

import { ChatInput } from "./input/ChatInput";

import { ChatNotFound } from "./ChatNotFound";
import { SmartIterations } from "./input/SmartIterations";
import { ChatSettingsMenu } from "./input/ChatSettingsMenu";
import { ArtifactProvider, useArtifact } from "../artifacts/ArtifactProvider";
import { ChatItem } from "./messages/ChatItem";
import { type DocumentOutputFormat } from "../../../backend/src/document/documentTypes";

export { ErrorDisplay as Catch } from "../util/ErrorDisplay";

interface ChatInterfaceProps {
  chatId: string;
  showSmartIterations?: boolean;
  showSettings?: boolean;
  showAttachmentButton?: boolean;
  embedded?: boolean;
  sheetProps?: React.ComponentProps<typeof Sheet>;
  onPrompt?: ({
    prompt,
    messageHistory,
    attachmentIds,
  }: {
    prompt: string;
    messageHistory: Message[];
    attachmentIds?: string[];
  }) => void;
  onMessageHistoryChange?: (
    messages: Message[],
    type: "prompt" | "response",
  ) => void;
  readonly?: boolean;
  customSystemPromptSuffix?: string;
  customTemperature?: number;
  autoFocus?: boolean;
}

export function ChatInterface({
  chatId,
  embedded,
  ...props
}: ChatInterfaceProps) {
  return (
    <div className="flex h-full">
      <ArtifactProvider chatId={chatId} embedded={embedded}>
        <Interface chatId={chatId} embedded={embedded} {...props} />
      </ArtifactProvider>
    </div>
  );
}

function Interface({
  chatId,
  showSmartIterations = true,
  showSettings = true,
  showAttachmentButton = true,
  embedded = false,
  sheetProps = {},
  onPrompt,
  onMessageHistoryChange,
  readonly = false,
  customSystemPromptSuffix,
  customTemperature,
  autoFocus = true,
}: ChatInterfaceProps) {
  // State
  const [tempMessages, setTempMessages] = useState([] as Message[]);
  const [completed, setCompleted] = useState(true);
  const waitingForQueuedMessage = useRef<boolean>(false);
  const [progress, setProgress] = useState<
    MessageGenerationProgress | undefined
  >(undefined);

  // Refs
  const lastHistoryChangeTrigger = useRef<Message[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const cancelFunctionRef = useRef<() => Promise<void>>();

  // Hooks
  const { showArtifact, visible } = useArtifact();
  const { t, i18n } = useTranslation();
  const me = useMe();
  const api = useOrganizationApi();
  const utils = trpc.useUtils();
  const mutateMessages = useCallback(() => {
    void utils.message.invalidate();
    void utils.artifact.invalidate();
  }, [utils]);

  // Stores
  const enqueueMessage = useQueuedMessagesStore((s) => s.addQueuedMessage);
  const clearMessageQueue = useQueuedMessagesStore((s) => s.clear);
  const queuedMessages = useQueuedMessagesStore((s) => s.queuedMessages);
  const shiftQueuedMessages = useQueuedMessagesStore(
    (s) => s.shiftQueuedMessage,
  );

  // Mutations
  const { mutateAsync: createMessageMutation } =
    trpc.message.postMessageAndRequestResponse.useMutation();
  const { mutateAsync: adjustTitle } = trpc.chat.adjustChatTitle.useMutation();
  const { mutateAsync: abortMessageGenerationMutation } =
    trpc.message.abortMessageResponse.useMutation();
  const { mutateAsync: setModelOverrideMutation } =
    trpc.chat.setModelOverride.useMutation({
      trpc: {
        context: {
          // t('chatUpdated')
          successMessage: "chatUpdated",
          // t('chatUpdateFailed')
          errorMessage: "chatUpdateFailed",
        },
      },
    });
  const { mutateAsync: quietModelOverride } =
    trpc.chat.setModelOverride.useMutation();

  // Queries
  const { data: organization } = trpc.organization.getOrganization.useQuery();
  const { data: chat, error: chatFetchError } = trpc.chat.get.useQuery(
    {
      chatId,
    },
    {
      trpc: {
        context: {
          silentError: true,
        },
      },
    },
  );
  const { data: apiMessages } = trpc.message.getMessagesForChat.useQuery(
    {
      chatId,
    },
    {
      trpc: {
        context: {
          silentError: true,
        },
      },
    },
  );

  const chatNotFound =
    chatFetchError && chatFetchError.data?.code === "NOT_FOUND";

  useEffect(() => {
    const completedApiMessages =
      apiMessages?.filter((m) => m.responseCompleted || !m.fromAi) ?? [];

    // Check if the filtered messages are the same as the previous ones, to avoid redundant updates
    if (_.isEqual(lastHistoryChangeTrigger.current, completedApiMessages))
      return;

    lastHistoryChangeTrigger.current = completedApiMessages;

    onMessageHistoryChange?.(
      completedApiMessages,
      completedApiMessages[completedApiMessages.length - 1]?.fromAi
        ? "response"
        : "prompt",
    );
  }, [apiMessages, onMessageHistoryChange]);

  useEffect(() => {
    if (completed) {
      void modelCheck();
      inputRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [completed]);

  const setModelOverride = async (
    model: string | null,
    quiet: boolean = false,
  ) => {
    if (quiet) {
      await quietModelOverride({
        chatId,
        modelOverride: model,
      });
    } else {
      await setModelOverrideMutation({
        chatId,
        modelOverride: model,
      });
    }

    void utils.chat.invalidate();
  };

  const getSelectedModel = () => {
    if (!chat?.modelOverride) return null;
    const { modelOverride } = chat;
    return !isSpecificLLM(modelOverride) || LLM_META[modelOverride].allowChat
      ? modelOverride
      : chat.organisationDefaultModel;
  };

  const selectedModel = getSelectedModel();

  const cancelMessageGeneration = useCallback(async () => {
    waitingForQueuedMessage.current = false;
    clearMessageQueue();
    if (completed) return;
    await cancelFunctionRef.current?.();
  }, [completed]);

  const createMessage = useCallback(
    async ({
      message,
      attachmentIds = [],
      customModel,
      outputFormat,
      workflowExecutionId,
    }: {
      message: string;
      attachmentIds?: string[];
      customModel?: ModelOverride;
      outputFormat?: DocumentOutputFormat | null;
      workflowExecutionId?: string;
    }) => {
      const isWorkflowOutput = outputFormat && workflowExecutionId;
      const promptTempMessages: Message[] = isWorkflowOutput
        ? []
        : [
            {
              fromAi: false,
              content: message,
              createdAt: new Date().toISOString(),
              authorId: me?.id ?? null,
              chatId,
              id: "temp",
              attachmentIds: attachmentIds,
              generationModel: null,
              responseCompleted: true,
              citations: [],
              artifactVersionId: null,
              cancelled: false,
              ragSources: [],
              tokens: 0,
            },
          ];

      setProgress(undefined);
      let mergedProgress = {};

      onPrompt?.({
        prompt: message,
        messageHistory: [...(apiMessages ?? []), ...promptTempMessages],
        attachmentIds,
      });

      function getGenerationModel() {
        if (customModel == null) {
          return null;
        }
        return isSpecificLLM(customModel) ? customModel : "gpt-4o-mini";
      }

      const aiTempMessage: Message = {
        fromAi: true,
        content: "",
        createdAt: new Date(Date.now() + 10).toISOString(),
        authorId: null,
        chatId,
        id: "temp_ai",
        attachmentIds: [],
        artifactVersionId: null,
        generationModel: getGenerationModel(),
        responseCompleted: false,
        citations: [],
        cancelled: false,
        ragSources: [],
        tokens: 0,
        outputDocumentUrl: isWorkflowOutput ? "LOADING" : undefined,
      };

      setTempMessages([...promptTempMessages, aiTempMessage]);

      setCompleted(false);

      let cancelled = false;

      // this is the function that will be called when the user cancels the message generation
      cancelFunctionRef.current = async () => {
        // only cancel once
        if (cancelled) return;
        cancelled = true;

        setCompleted(true);
        waitingForQueuedMessage.current = false;

        // the AI message id should always be here, since the server sends it first thing in the response, if not, there is also no content we need to sync. If the user actually does manage to cancel before the package arrives, the message won't be marked as cancelled and when the user refreshes the page later the generated message will be displayed.
        aiMessageId.current &&
          (await abortMessageGenerationMutation({
            chatId,
            messageId: aiMessageId.current,
            receivedContent: fullResponse,
          }));

        // server messages sync and then flush temp message
        mutateMessages();
        setTempMessages([]);
      };

      // this will be the package stream for the completion
      const res = await createMessageMutation({
        content: message,
        language: i18n.language?.split("-")[0] ?? "en",
        attachmentIds,
        customSystemPromptSuffix,
        temperature: customTemperature,
        chatId,
        modelOverride: customModel,
        outputFormat,
        workflowExecutionId,
      });

      // here we accumulate the response from the incoming chunks
      let fullResponse = "";

      // a ref to the AI message id, so we can cancel it if needed
      const aiMessageId: {
        current: string | null;
      } = { current: null };

      // iterate over the chunks from the server
      for await (const chunk of res) {
        // if the user cancelled, break the loop
        if (cancelled) break;

        // if the AI message id is in the chunk, set it and skip this packages since it is not a response
        if ("aiMessageId" in chunk) {
          aiMessageId.current = chunk.aiMessageId;
          setTempMessages((currentTempMessages) =>
            currentTempMessages.map((m) =>
              m.fromAi
                ? {
                    ...m,
                    generationModel: chunk.generationModel,
                    id: chunk.aiMessageId,
                  }
                : m,
            ),
          );
          continue;
        }

        if ("progress" in chunk) {
          mergedProgress = _.merge({}, mergedProgress, chunk.progress);
          setProgress(mergedProgress);
          continue;
        }

        fullResponse += chunk.delta;

        // update the temp message with the response
        setTempMessages((currentTempMessages) =>
          currentTempMessages.map((m) =>
            m.fromAi
              ? {
                  ...m,
                  content: fullResponse,
                  citations: chunk.citations,
                }
              : m,
          ),
        );
      }
      // if the user cancelled, we don't need to sync the messages since that already happened
      if (cancelled) return;
      if (fullResponse.includes("<artifact>")) {
        await utils.artifact.invalidate();
        showArtifact();
      }
      mutateMessages();
      setCompleted(true);
      void updateTitle();
      waitingForQueuedMessage.current = false;
      setTempMessages([]);
    },
    [
      abortMessageGenerationMutation,
      createMessageMutation,
      customTemperature,
      onPrompt,
      apiMessages,
      chatId,
      me?.id,
      mutateMessages,
      i18n.language,
      apiMessages,
      customSystemPromptSuffix,
    ],
  );

  const regenerateMessage = useCallback(
    async (aiMessageId: Message) => {
      await cancelMessageGeneration();

      if (!apiMessages) return; // impossible
      // get the messsage before the AI message
      const index = apiMessages.findIndex((m) => m.id === aiMessageId.id);
      const userMessage = apiMessages[index - 1];
      if (!userMessage) {
        handleGenericError(
          new Error("no user message found before ai message"),
          "generateMessageFailed",
          {
            messages: apiMessages,
            aiMessageId,
          },
          true,
        );
      }

      await api.delete(`chats/${chatId}/messages/${userMessage.id}/following`);
      await mutateMessages();

      enqueueMessage({
        chatId,
        content: userMessage.content,
        attachmentIds: userMessage.attachmentIds,
      });
    },
    [
      api,
      apiMessages,
      mutateMessages,
      chatId,
      enqueueMessage,
      cancelMessageGeneration,
    ],
  );

  const editMessage = useCallback(
    async (oldMessageId: string, content: string) => {
      await cancelMessageGeneration();

      if (!apiMessages) return; // impossible
      const oldMessage = apiMessages.find((m) => m.id === oldMessageId);
      if (!oldMessage) {
        // if we are currently generating a message it will not be in the apiMessages
        await mutateMessages();
        const updatedMessages =
          await utils.message.getMessagesForChat.ensureData({
            chatId,
          });

        // the message we are trying to edit will be the second last message
        const updatedOldMessage = updatedMessages[updatedMessages.length - 2];
        if (!updatedOldMessage) {
          handleGenericError(
            new Error("no message found to edit"),
            "generateMessageFailed",
            {
              messages: updatedMessages,
              oldMessageId,
            },
            true,
          );
        }
        oldMessageId = updatedOldMessage.id;
      }
      await api.delete(`chats/${chatId}/messages/${oldMessageId}/following`);
      await mutateMessages();
      enqueueMessage({
        chatId,
        content,
        attachmentIds: oldMessage?.attachmentIds ?? [],
      });
    },
    [
      api,
      mutateMessages,
      chatId,
      apiMessages,
      enqueueMessage,
      cancelMessageGeneration,
    ],
  );

  const updateTitle = async () => {
    if (chat?.name) return;
    await adjustTitle({ chatId });
    void utils.chat.invalidate();
  };

  const modelCheck = async () => {
    const openMessages = queuedMessages.some((m) => m.chatId === chatId);
    if (
      openMessages ||
      !chat?.modelOverride ||
      !isSpecificLLM(chat.modelOverride)
    )
      return;
    const { allowChat } = LLM_META[chat.modelOverride];

    if (!allowChat) {
      void setModelOverride(organization?.defaultModel ?? "gpt-4o", true);
    }
  };

  useEffect(() => {
    if (!chat) return;
    const filteredMessage = queuedMessages.find((m) => m.chatId === chatId);
    if (filteredMessage && !waitingForQueuedMessage.current) {
      createMessage({
        message: filteredMessage.content,
        attachmentIds: filteredMessage.attachmentIds,
        customModel: filteredMessage.modelOverride,
        outputFormat: filteredMessage.outputFormat,
        workflowExecutionId: filteredMessage.workflowExecutionId,
      }).catch((e: Error) => {
        // check if its this: DOMException: BodyStreamBuffer was aborted
        if (e.name === "AbortError") return;

        handleGenericError(e, "messageSendFailed", {
          filteredMessage,
        });
        console.error(e);
      });
      waitingForQueuedMessage.current = true;
      shiftQueuedMessages();
    }
  }, [
    queuedMessages.length,
    chat,
    chatId,
    createMessage,
    shiftQueuedMessages,
    queuedMessages,
    t,
    completed,
  ]);

  const chatName = maxStringLength(chat?.name ?? undefined, 80);

  const messagesList = useMemo(
    () =>
      (apiMessages
        ? [
            ...apiMessages,
            ...tempMessages.map((c) => ({ ...c, id: c.id + "temp" })),
          ]
        : []
      ).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [apiMessages, tempMessages],
  );

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messagesList.length]);

  if (chatNotFound) return <ChatNotFound />;

  if (!chat || !apiMessages)
    return (
      <Sheet
        className={twMerge("relative h-full w-full")}
        variant="soft"
        {...sheetProps}
        sx={{
          backgroundColor: embedded ? "transparent" : undefined,
        }}
      >
        <DelayedLoader />
      </Sheet>
    );

  const chatTokens = apiMessages.reduce((acc, m) => acc + m.tokens, 0);

  const postMessage = async ({
    content,
    attachmentIds,
  }: {
    content: string;
    attachmentIds: string[];
  }) => {
    await cancelMessageGeneration();
    enqueueMessage({
      chatId,
      content,
      attachmentIds,
    });
  };

  return (
    <Sheet
      className="relative flex h-full w-full grow flex-col overflow-x-hidden"
      variant="soft"
      {...sheetProps}
      sx={{
        backgroundColor: embedded ? "transparent" : undefined,
      }}
      onClick={() => {
        embedded && inputRef.current?.focus();
      }}
    >
      <div
        className={twMerge(
          "flex flex-grow flex-col justify-between overflow-y-auto overscroll-y-contain",
          visible && "no-scrollbar",
        )}
        ref={chatContainerRef}
      >
        {!embedded && (
          <span className="p-20 text-center text-4xl">{chatName}</span>
        )}
        <div className="flex flex-col-reverse">
          {messagesList.map((message) => (
            <ChatItem
              key={message.id}
              chat={chat}
              message={message}
              onEdit={async (content: string) => {
                await editMessage(message.id, content);
              }}
              progress={progress}
              regenerateMessage={regenerateMessage}
              setModelOverride={setModelOverride}
              embedded={embedded}
            />
          ))}
        </div>
      </div>

      {!readonly && (
        <div
          className={twMerge(
            "relative z-10 flex w-full flex-col items-stretch justify-center bg-[#F0F4F8] px-10 pb-8 pt-0",
            embedded && "bg-transparent p-0",
          )}
        >
          {/* The fade effect between chat and input */}
          <div
            className={twMerge(
              "absolute top-0 h-8 w-full -translate-y-[100%] bg-gradient-to-t from-[#F0F4F8] to-transparent",
              embedded && "from-white",
            )}
          />
          {showSmartIterations && (
            <div className="mb-4 flex w-full flex-row justify-center gap-4 overflow-x-auto">
              <SmartIterations
                disabled={!completed}
                onClick={(prompt) => {
                  enqueueMessage({
                    chatId,
                    content: prompt,
                  });
                }}
              />
            </div>
          )}
          <ChatInput
            chat={chat}
            isGenerating={!completed}
            embedded={embedded}
            model={chat.modelOverride ?? organization?.defaultModel}
            setModelOverride={setModelOverride}
            chatTokens={chatTokens}
            postMessage={postMessage}
            onCancel={cancelMessageGeneration}
            ref={inputRef}
            autoFocus={autoFocus}
            showAttachmentButton={showAttachmentButton}
            startDecorator={
              showSettings && (
                <ChatSettingsMenu
                  selectedModel={selectedModel}
                  setSelectedModel={setModelOverride}
                />
              )
            }
          />
        </div>
      )}
    </Sheet>
  );
}
