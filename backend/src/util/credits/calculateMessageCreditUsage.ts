import {
  CREDIT_MARGIN_FACTOR,
  LLM_META,
  type LlmMetaData,
  type LlmName,
} from "@backend/ai/llmMeta";
import type { CreditUsageOptions } from "@backend/credits/credits.service";

const CONVERSION_FACTORS: Record<LlmMetaData["price"]["unit"], number> = {
  perMillion: 1_000_000,
  perThousand: 1_000,
};

const CREDIT_PER_EURO = 100;

type TextGenerationOptions = {
  inputTokens: number;
  outputTokens: number;
  model: LlmName;
};

export function calculateMessageCreditUsage(options: TextGenerationOptions) {
  const modelInfo = LLM_META[options.model];
  const unit = modelInfo.price.unit;
  const costPerTokenConversionFactor = CONVERSION_FACTORS[unit];

  const inputCostPerToken =
    modelInfo.price.inputTokens / costPerTokenConversionFactor;
  const outputCostPerTokens =
    modelInfo.price.outputTokens / costPerTokenConversionFactor;

  // Calculate the needed tokens and convert them to credits
  const totalCostRawCost =
    options.inputTokens * inputCostPerToken +
    options.outputTokens * outputCostPerTokens;

  const totalCost = totalCostRawCost * CREDIT_PER_EURO * CREDIT_MARGIN_FACTOR;

  return {
    totalCost,
    inputCostPerToken,
    outputCostPerTokens,
  };
}
