const common = [
  'ar',
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'es',
  'et',
  'fi',
  'fr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'lt',
  'lv',
  'nb',
  'nl',
  'pl',
  'ro',
  'ru',
  'sk',
  'sl',
  'sv',
  'tr',
  'uk',
  'zh',
] as const;

export const DEEPL_LANGUAGES_TARGET = [
  ...common,
  'en-GB',
  'en-US',
  'pt-BR',
  'pt-PT',
] as const;

export const DEEPL_LANGUAGES_SOURCE = [...common, 'en', 'pt'] as const;

export const DEEPL_GLOSSARY_LANGUAGE = [
  'da',
  'de',
  'en',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'nb',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'sv',
  'zh',
] as const;

export const DEEPL_DOCUMENT_FORMALITIES = [
  'default',
  'more',
  'less',
  'prefer_more',
  'prefer_less',
] as const;

export type DeepLTargetLanguages = typeof DEEPL_LANGUAGES_TARGET;
export type DeepLTargetLanguage = DeepLTargetLanguages[number];

export type DeepLSourceLanguages = typeof DEEPL_LANGUAGES_SOURCE;
export type DeepLSourceLanguage = DeepLSourceLanguages[number];
export type DeepLSourceLanguageWithDetect = DeepLSourceLanguage | 'detect';

export type DeeplyGlossaryLanguage = (typeof DEEPL_GLOSSARY_LANGUAGE)[number];
