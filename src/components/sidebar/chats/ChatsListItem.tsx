import { useState } from "react";
import { ChatBubbleOutline, History } from "@mui/icons-material";
import { useParams, useNavigate } from "../../../router";
import { useTranslation } from "../../../lib/i18n";
import { toast } from "react-toastify";
import { type ChatListItem } from "../../../../backend/src/api/chat/chatTypes";
import { trpc } from "../../../lib/api/trpc/trpc";
import { ConfirmModal } from "../tree/ConfirmModal";
import { LeafItem } from "../tree/LeafItem";
import { LeafItemDropdown } from "../tree/LeafItemDropdown";
import { RenameChatModal } from "./RenameChatModal";

export function ChatsListItem({
  chat,
  isHistoryButton,
}: {
  chat?: ChatListItem;
  isHistoryButton?: boolean;
}) {
  const { t } = useTranslation();

  const params = useParams("/:organizationId/chats/:chatId");
  const active = params.chatId === chat?.id;
  const navigate = useNavigate();
  const { mutateAsync: deleteChat } = trpc.chat.archive.useMutation();
  const utils = trpc.useUtils();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  let chatName;

  if (chat?.name) {
    chatName = chat.name;
  } else if (isHistoryButton) {
    chatName = (
      <div className="flex items-center gap-1">
        <History fontSize="small" />
        {t("sidebar.allChats")}
      </div>
    );
  } else {
    chatName = t("newChat");
  }

  return (
    <>
      <LeafItem
        icon={
          <ChatBubbleOutline
            sx={{ fontSize: "1rem" }}
            color={active ? "primary" : undefined}
          />
        }
        singleLine={true}
        name={chatName}
        endDecorator={
          isHistoryButton ? undefined : (
            <div onClick={(e) => e.stopPropagation()} className="h-[22px]">
              <LeafItemDropdown
                onEdit={() => setRenameModalOpen(true)}
                onDelete={() => setConfirmModalOpen(true)}
              />
            </div>
          )
        }
        isSelected={active}
        onClick={() => {
          if (chat) {
            //TODO convert LeafItem to a Link instead?
            void navigate("/:organizationId/chats/:chatId", {
              params: {
                ...params,
                chatId: chat.id,
              },
            });
          }
        }}
      />
      {chat && (
        <>
          <RenameChatModal
            chat={chat}
            open={renameModalOpen}
            onClose={() => setRenameModalOpen(false)}
          />
          <ConfirmModal
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onSure={() => {
              toast
                .promise(
                  deleteChat({ chatId: chat.id }).then(() =>
                    utils.chat.invalidate()
                  ),
                  {
                    success: t("chatDeleted"),
                    error: t("chatDeleteFailed"),
                  }
                )
                .catch((e) => console.error(e));
              if (!active) {
                return;
              }
              void navigate("/:organizationId", { params });
            }}
          />
        </>
      )}
    </>
  );
}
