export async function parsePptx(buffer: Buffer): Promise<string> {
  const JSZip = (await import('jszip')) as unknown as typeof import('jszip');
  const zip = await JSZip.loadAsync(buffer);
  const xmlNames = Object.keys(zip.files).filter((n) => n.endsWith('.xml'));
  const texts: string[] = [];

  for (const name of xmlNames) {
    const file = zip.file(name);
    if (!file) continue;
    const content = await file.async('string');
    const matches = content.match(/<a:t>([^<]*)<\/a:t>/g);
    if (matches) {
      for (const m of matches) {
        const inner = m.replace(/<\/?a:t>/g, '');
        if (inner.trim()) texts.push(inner);
      }
    }
  }
  return texts.join('\n');
}
