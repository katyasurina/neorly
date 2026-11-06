export const SYSTEM_PROMPT = `Ти — експерт з навчальних матеріалів. Твоє завдання — перетворити текст на структурований конспект, флешкартки та тестові питання. 
Мова — та сама, що в тексті. 
Картки — атомарні, одна ідея на картку. 
Тести — 4 варіанти, 1 правильна, з поясненням. 
СУВОРО дотримуйся JSON-схеми.`;

export function buildUserPrompt(
  text: string,
  generateNotes = true,
  generateFlashcards = true,
  generateQuiz = false,
  detailLevel = 2,
  flashcardsCount = 10,
  quizCount = 5
): string {
  let parts: string[] = [];

  // Визначаємо обсяг конспекту залежно від повзунка
  let detailInstruction = "";
  if (detailLevel === 1) detailInstruction = "Зроби СТИСЛИЙ конспект (тільки найголовніше, без води).";
  if (detailLevel === 2) detailInstruction = "Зроби ЗБАЛАНСОВАНИЙ конспект (ключові терміни та факти).";
  if (detailLevel === 3) detailInstruction = "Зроби ДУЖЕ ДЕТАЛЬНИЙ конспект (розкрий всі підтеми, додай приклади та пояснення).";

  if (generateNotes) {
    parts.push(`
ЗАВДАННЯ: Створи конспект.
${detailInstruction}
ВИМОГИ ДО ФОРМАТУ (Markdown):
1. Обов'язково використовуй заголовки ## та ### для структури.
2. Використовуй **жирний текст** для ключових термінів та визначень.
3. Використовуй марковані списки (-) для переліків.
4. Кожна думка має бути з нового рядка. НЕ пиши суцільним текстом!
5. Конспект має виглядати як професійна шпаргалка.
`);
  }

  if (generateFlashcards) {
    // Вказуємо точну кількість карток
    parts.push(`Згенеруй рівно ${flashcardsCount} флешкарток (питання-відповідь).`);
  }

  if (generateQuiz) {
    // Вказуємо точну кількість тестів
    parts.push(`Згенеруй рівно ${quizCount} тестових питань з 4 варіантами відповіді та поясненням.`);
  }

  if (!generateNotes && !generateFlashcards && !generateQuiz) {
    parts.push("Згенеруй порожній пакет (тільки заголовок).");
  }

  return `
Ось матеріал для обробки:
---
${text}
---

${parts.join('\n')}
`;
}