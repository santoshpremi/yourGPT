import type { LlmName } from "../../../backend/src/ai/llmMeta";
import type { ModelOverride } from "../../../backend/src/api/chat/chatTypes";

export function isSpecificLLM(model: ModelOverride): model is LlmName {
  return model !== "automatic";
}