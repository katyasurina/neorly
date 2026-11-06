import { GoogleGenAI } from '@google/genai';
import { GeneratedPackSchema, GeneratedPack } from './schemas';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';

export async function generatePack(
  text: string,
  generateNotes = true,
  generateFlashcards = true,
  generateQuiz = false,
  detailLevel = 2, // 1 - коротко, 2 - середньо, 3 - детально
  flashcardsCount = 10 // Кількість карток
): Promise<GeneratedPack> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const responseSchema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      notes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
          },
          required: ['title', 'content'],
          additionalProperties: false,
        },
      },
      flashcards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            front: { type: 'string' },
            back: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['front', 'back', 'tags'],
          additionalProperties: false,
        },
      },
      quiz: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            correctIndex: { type: 'integer', minimum: 0, maximum: 3 },
            explanation: { type: 'string' },
          },
          required: ['question', 'options', 'correctIndex', 'explanation'],
          additionalProperties: false,
        },
      },
    },
    required: ['title', 'notes', 'flashcards', 'quiz'],
    additionalProperties: false,
  };

  let lastError: any;
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Спроба ${attempt} відправити запит до Gemini...`);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT: Сервер Gemini не відповідає понад 45 секунд')), 45000);
      });

      const requestPromise = ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        // Передаємо flashcardsCount у промпт
        contents: buildUserPrompt(text, generateNotes, generateFlashcards, generateQuiz, detailLevel, flashcardsCount),
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: responseSchema as any,
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      const response: any = await Promise.race([requestPromise, timeoutPromise]);

      const rawText = response.text || '';
      if (!rawText.trim()) {
        throw new Error('AI failed to generate valid JSON');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        throw new Error('AI failed to generate valid JSON');
      }

      const result = GeneratedPackSchema.parse(parsed);
      
      if (!generateNotes) result.notes = [];
      if (!generateFlashcards) result.flashcards = [];
      if (!generateQuiz) result.quiz = [];

      return result;

    } catch (error: any) {
      lastError = error;
      console.error(`Спроба ${attempt} невдала:`, error.message || error);

      const isRetryable = 
        error.status === 503 || 
        error.status === 429 || 
        error.message?.includes('TIMEOUT') ||
        error.message?.includes('fetch failed');
      
      if (isRetryable && attempt < maxRetries) {
        const waitTime = attempt * 3000;
        console.log(`Помилка. Чекаємо ${waitTime / 1000} секунд і пробуємо знову...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      throw error;
    }
  }

  throw lastError;
}