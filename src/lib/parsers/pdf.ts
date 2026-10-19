export async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')) as { default: (data: Buffer) => Promise<{ text: string }> };
  const res = await pdfParse.default(buffer);
  return res.text;
}
