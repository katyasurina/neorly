export const SYSTEM_PROMPT = `Ти — експерт з навчальних матеріалів. Твоє завдання — перетворити текст на структурований конспект, флешкартки та тестові питання. Мова — та сама, що в тексті. Конспект — markdown з ### підзаголовками. Картки — атомарні, одна ідея на картку. Тести — 4 варіанти, 1 правильна, з поясненням. СУВОРО дотримуйся JSON-схеми.`;

export function buildUserPrompt(
  text: string,
  generateNotes = true,
  generateFlashcards = true,
  generateQuiz = false
): string {
  const parts = [`Ось матеріал:\n\n${text}\n`];
  if (generateNotes) parts.push('Згенеруй конспект.');
  if (generateFlashcards) parts.push('Згенеруй флешкартки.');
  if (generateQuiz) parts.push('Згенеруй тести.');
  if (!generateNotes && !generateFlashcards && !generateQuiz) parts.push('Згенеруй порожній пакет (тільки заголовок).');
  return parts.join('\n');
}