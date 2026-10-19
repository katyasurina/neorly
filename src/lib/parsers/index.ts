import { parsePdf } from './pdf';
import { parseDocx } from './docx';
import { parsePptx } from './pptx';
import { parseTxt } from './txt';

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
] as const;

export type SupportedMime = (typeof SUPPORTED_MIME_TYPES)[number];

export async function parseFile(buffer: Buffer, mime: string): Promise<string> {
  switch (mime) {
    case 'application/pdf':
      return parsePdf(buffer);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return parseDocx(buffer);
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return parsePptx(buffer);
    case 'text/plain':
    case 'text/markdown':
      return parseTxt(buffer);
    default:
      throw new Error(`Непідтримуваний тип файлу: ${mime}`);
  }
}
