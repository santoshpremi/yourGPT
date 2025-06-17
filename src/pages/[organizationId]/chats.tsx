// src/pages/[organizationId]/chats.tsx
import { Typography, Button, List } from "@mui/joy";
import { useNavigate, useParams } from "../../router";
import { TrpcProvider } from "../../lib/api/trpc/TrpcProvider";
import { trpc } from "../../lib/api/trpc/trpc";
import { useTranslation } from "../../lib/i18n";
import { DelayedLoader } from "../../components/util/DelayedLoader";
import { ChatsListItem } from "../../components/sidebar/chats/ChatsListItem";
import { Add } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import type { ChatListItem } from "../../../backend/src/api/chat/chatTypes";

export default function ChatsPage() {
  return (
    <TrpcProvider>
      <ChatsPageContent />
    </TrpcProvider>
  );
}

function ChatsPageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams("/:organizationId");

  const { data: chatsData, isLoading } = trpc.chat.getAll.useQuery({
    limit: 50, // Show more chats on the dedicated page
  });

  const { mutateAsync: createChat } = trpc.chat.create.useMutation();

  const handleNewChat = async () => {
    try {
      const newChatId = uuidv4();
      await createChat({
        id: newChatId,
        name: null,
        organizationId: params.organizationId,
      });
      
      void navigate("/:organizationId/chats/:chatId", {
        params: {
          organizationId: params.organizationId,
          chatId: newChatId,
        },
      });
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <DelayedLoader />
      </div>
    );
  }

  const chats = chatsData?.items || [];

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <Typography level="h2">{t("sidebar.allChats", "All Chats")}</Typography>
        <Button
          onClick={handleNewChat}
          startDecorator={<Add />}
          variant="solid"
        >
          {t("newChat", "New Chat")}
        </Button>
      </div>

      {chats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <Typography level="body-lg" color="neutral">
            {t("noChats", "No chats yet")}
          </Typography>
          <Button
            onClick={handleNewChat}
            startDecorator={<Add />}
            variant="outlined"
            size="lg"
          >
            {t("createFirstChat", "Create your first chat")}
          </Button>
        </div>
      ) : (
        <List className="gap-2">
          {chats.map((chat: ChatListItem) => (
            <ChatsListItem key={chat.id} chat={chat} />
          ))}
        </List>
      )}
    </div>
  );
}