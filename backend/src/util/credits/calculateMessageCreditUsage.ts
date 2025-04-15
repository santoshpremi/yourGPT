import {
  CREDIT_MARGIN_FACTOR,
  LLM_META,
  type LlmMetaData,
} from "../../ai/llmMeta";
import type { CreditUsageOptions } from "../../credits/credits.service";

const CONVERSION_FACTORS: Record<LlmMetaData["price"]["unit"], number> = {
  perMillion: 1_000_000,
  perThousand: 1_000,
};

const CREDIT_PER_EURO = 100;

export function calculateMessageCreditUsage({
  inputTokens,
  outputTokens,
  model,
}: CreditUsageOptions["TEXT_GENERATION"]) {
  const modelInfo = LLM_META[model];

  const costPerTokenConversionFactor = CONVERSION_FACTORS[modelInfo.price.unit];

  const inputCostPerToken =
    modelInfo.price.inputTokens / costPerTokenConversionFactor;
  const outputCostPerTokens =
    modelInfo.price.outputTokens / costPerTokenConversionFactor;

  // Calculate the needed tokens and convert them to credits
  const totalCostRawCost =
    inputTokens * inputCostPerToken + outputTokens * outputCostPerTokens;

  const totalCost = totalCostRawCost * CREDIT_PER_EURO * CREDIT_MARGIN_FACTOR;

  return {
    totalCost,
    inputCostPerToken,
    outputCostPerTokens,
  };
}
