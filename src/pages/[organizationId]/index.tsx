// src/pages/[organizationId]/index.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "../../router";
import { TrpcProvider } from "../../lib/api/trpc/TrpcProvider";
import { trpc } from "../../lib/api/trpc/trpc";
import { CircularProgress, Typography, Button } from "@mui/joy";
import { useTranslation } from "../../lib/i18n";
import { v4 as uuidv4 } from "uuid";

export default function OrganizationHomePage() {
  return (
    <TrpcProvider>
      <OrganizationHome />
    </TrpcProvider>
  );
}

function OrganizationHome() {
  const navigate = useNavigate();
  const params = useParams("/:organizationId");
  const { t } = useTranslation();

  // Get the most recent chat or create a new one
  const { data: chatsData, isLoading } = trpc.chat.getAll.useQuery({
    limit: 1,
  });

  const { mutateAsync: createChat } = trpc.chat.create.useMutation();

  useEffect(() => {
    const handleRedirect = async () => {
      if (isLoading) return;

      try {
        if (chatsData?.items && chatsData.items.length > 0) {
          // Redirect to the most recent chat
          const mostRecentChat = chatsData.items[0];
          void navigate("/:organizationId/chats/:chatId", {
            params: {
              organizationId: params.organizationId,
              chatId: mostRecentChat.id,
            },
            replace: true,
          });
        } else {
          // Create a new chat and redirect to it
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
            replace: true,
          });
        }
      } catch (error) {
        console.error("Failed to redirect to chat:", error);
        // Show error state or create new chat manually
      }
    };

    handleRedirect();
  }, [isLoading, chatsData, navigate, params.organizationId, createChat]);

  // Show loading state while determining where to redirect
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress />
        <Typography level="body-lg">
          {t("loading", "Loading chat...")}
        </Typography>
      </div>
    </div>
  );
}