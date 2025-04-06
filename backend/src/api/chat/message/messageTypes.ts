import { ApiDate } from '../../../../../packages/apiTypes/src/Date';
import z from 'zod';
import { LlmName } from '../../../ai/llmMeta';
import { ModelOverride } from '../chatTypes';
import { DocumentOutputFormat } from '../../../document/documentTypes';

export const CreateMessageInput = z.object({
  content: z.string().min(1),
  language: z.string().default('en'),
  attachmentIds: z.array(z.string()).default([]),
  customSystemPromptSuffix: z.string().optional(),
  temperature: z.number().optional(),
  ragMode: z.boolean().default(false),
  modelOverride: ModelOverride.optional(),
  outputFormat: DocumentOutputFormat.nullish(),
  workflowExecutionId: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageInput>;

export type MessageResponse =
  | { aiMessageId: string; generationModel: LlmName }
  | {
      citations: Array<string>;
      content: string;
      delta: string;
    }
  | {
      progress: MessageGenerationProgress;
    };

const ResultComponent = z.object({
  score: z.number(),
  result: z.string(),
  documentTitle: z.string(),
  documentId: z.string(),
  sourceNumber: z.number().int().optional(),
});

export type ResultComponent = z.infer<typeof ResultComponent>;

const RagSource = z.object({
  id: z.string(),
  queries: z.array(z.string()).optional(),
  knowledgeCollectionId: z.string(),
  resultComponents: z.array(ResultComponent),
});

export type RagSource = z.infer<typeof RagSource>;

export const Message = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: ApiDate,
  fromAi: z.boolean(),
  responseCompleted: z.boolean().nullable(),
  authorId: z.string().nullable(),
  chatId: z.string(),
  generationModel: LlmName.default('gpt-4o-mini' satisfies LlmName).nullable(),
  attachmentIds: z.array(z.string()).default([]),
  ragSources: z.array(RagSource).default([]),
  citations: z.array(z.string()).default([]),
  artifactVersionId: z.string().nullable(),
  cancelled: z.boolean().nullable(),
  errorCode: z.string().nullable().optional(),
  tokens: z.number(),
  outputDocumentUrl: z.string().nullish(),
});

export type Message = z.infer<typeof Message>;

export enum MessageGenerationStep {
  /** The RAG agent is generating queries and deciding which knowledgeCollections to search in*/
  FormulatingQueries = 'formulatingQueries',
  /** The RAG system is queried for information */
  SearchingForInformation = 'searchingForInformation',
  /** The AI is generating the final response */
  GeneratingResponse = 'generatingResponse',
}

export type MessageGenerationProgress = {
  totalSteps?: number;
  currentStepNumber?: number;
  currentStepType?: MessageGenerationStep;
  queryCount?: number;
  collectionCount?: number;
};
