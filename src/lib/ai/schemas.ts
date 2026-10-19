import { z } from 'zod';

export const GeneratedNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const GeneratedFlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  tags: z.array(z.string()),
});

export const GeneratedQuizSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
});

export const GeneratedPackSchema = z.object({
  title: z.string(),
  notes: z.array(GeneratedNoteSchema).min(1),
  flashcards: z.array(GeneratedFlashcardSchema).min(5),
  quiz: z.array(GeneratedQuizSchema).min(3),
});

export type GeneratedPack = z.infer<typeof GeneratedPackSchema>;
