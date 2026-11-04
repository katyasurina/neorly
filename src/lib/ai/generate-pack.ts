import { GoogleGenAI } from '@google/genai';
import { GeneratedPackSchema, GeneratedPack } from './schemas';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';

export async function generatePack(
  text: string,
  generateNotes = true,
  generateFlashcards = true,
  generateQuiz = false
): Promise<GeneratedPack> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Build JSON schema inline to avoid zod-to-json-schema type conflicts with zod v4
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

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: buildUserPrompt(text, generateNotes, generateFlashcards, generateQuiz),
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: responseSchema as any,
      systemInstruction: SYSTEM_PROMPT,
    },
  });

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
  // Force empty arrays when generation disabled
  if (!generateNotes) result.notes = [];
  if (!generateFlashcards) result.flashcards = [];
  if (!generateQuiz) result.quiz = [];
  return result;
}