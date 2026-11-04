-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "generateFlashcards" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "generateNotes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "generateQuiz" BOOLEAN NOT NULL DEFAULT false;
