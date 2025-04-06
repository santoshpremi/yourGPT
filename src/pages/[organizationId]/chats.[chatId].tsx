export { ErrorDisplay as Catch } from "../../components/util/ErrorDisplay";

import { ChatInterface } from "../../components/chat/ChatInterface";
import { useParams } from "../../router";

export default function Chat() {
  const params = useParams("/:organizationId/chats/:chatId");

  return <ChatInterface key={params.chatId} chatId={params.chatId} />;
}
