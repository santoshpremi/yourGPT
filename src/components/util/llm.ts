import type { LlmName } from "../../../../backend/src/ai/llmMeta.ts";
import type { ModelOverride } from "../../../../backend/src/api/chat/chatTypes.ts";

export function isSpecificLLM(model: ModelOverride): model is LlmName {
  return model !== "automatic";
}
