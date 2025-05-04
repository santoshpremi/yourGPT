import type { LlmName } from "../ai/llmMeta";

export interface CreditUsageOptions {
  TEXT_GENERATION: {
    inputTokens: number;
    outputTokens: number;
    model: LlmName;
  };
}