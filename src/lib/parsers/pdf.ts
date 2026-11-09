import { extractText, getDocumentProxy } from 'unpdf';

export async function parsePdf(buffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer);
  
  // Завантажуємо PDF-документ за допомогою getDocumentProxy
  const pdf = await getDocumentProxy(uint8Array);
  
  // Витягуємо текст з усіх сторінок в один рядок
  const { text } = await extractText(pdf, { mergePages: true });
  
  return text;
}