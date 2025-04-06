// File: ../util/env.ts


export const env = {
  DEV_LITELLM_BASE_URL: process.env.DEV_LITELLM_BASE_URL || '',
  LITELLM_API_KEY: process.env.LITELLM_API_KEY || '',
  PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || '',
  AZURE_API_GPT4O_MINI_ENDPOINT: process.env.AZURE_API_GPT4O_MINI_ENDPOINT || '',
  AZURE_API_GPT4O_MINI_API_KEY: process.env.AZURE_API_GPT4O_MINI_API_KEY || '',
  AZURE_API_GPT4O_ENDPOINT: process.env.AZURE_API_GPT4O_ENDPOINT || '',
  AZURE_API_GPT4O_API_KEY: process.env.AZURE_API_GPT4O_API_KEY || '',
};