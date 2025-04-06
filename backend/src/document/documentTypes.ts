import z from 'zod';
import { DOCUMENT_OUTPUT_TYPE_TO_MIME_MAP } from '../constants/mime';

export const PandocOutputFormat = z.enum(['docx', 'txt', 'pdf', 'pptx']);
export type PandocOutputFormat = z.infer<typeof PandocOutputFormat>;

// A superset of PandocOutputFormat
// Additional formats are handled by DocumentGenerationService
export const TableOutputFormat = z.enum(
  DOCUMENT_OUTPUT_TYPE_TO_MIME_MAP['table'],
);
export const DocumentOutputFormat = z.enum([
  ...DOCUMENT_OUTPUT_TYPE_TO_MIME_MAP['document'],
  ...TableOutputFormat.options,
  ...DOCUMENT_OUTPUT_TYPE_TO_MIME_MAP['presentation'],
]);
export type TableOutputFormat = z.infer<typeof TableOutputFormat>;
export type DocumentOutputFormat = z.infer<typeof DocumentOutputFormat>;
