// ChatPage.tsx
import { useSearchParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import ChatInterface from "../components/chat/ChatInterface";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');

  return (
    <Container maxWidth={false} sx={{ height: 'calc(100vh - 64px)', p: 0 }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ChatInterface chatId={chatId || undefined} />
      </Box>
    </Container>
  );
} 