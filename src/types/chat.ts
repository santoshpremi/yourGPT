import { LlmName } from "@backend/ai/llmMeta";

// frontend/src/types/chat.ts
export type Message = {
  id: string;
  content: string;
  chatId: string;
  createdAt: string;
  fromAi: boolean;
  responseCompleted: boolean | null;
  authorId: string | null;
  generationModel: LlmName | null;
  attachmentIds: string[];
  tokens: number;
  // ... other fields ...
};

export type Chat = {
  id: string;
  name: string | null;
  createdAt: string;
  artifactId: string | null;
  updatedAt: string;
  modelOverride: LlmName | null;
  ragMode: string;
  creditWarningAccepted: boolean;
};
