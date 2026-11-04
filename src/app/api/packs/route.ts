import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SUPPORTED_MIME_TYPES, SupportedMime, parseFile } from '@/lib/parsers';
import { generatePack } from '@/lib/ai/generate-pack';
import type { GeneratedPack } from '@/lib/ai/schemas';

const BUCKET = 'packs';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const packs = await prisma.pack.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      sourceFile: true,
      sourceMime: true,
      status: true,
      errorMessage: true,
      createdAt: true,
      _count: { select: { notes: true, flashcards: true, quizQuestions: true } },
    },
  });

  return NextResponse.json({ packs });
}

export async function POST(request: NextRequest) {
  console.log("1. API ROUTE STARTED");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const title = (formData.get('title') as string) || '';
  const generateNotes = formData.get('generateNotes') === 'true';
  const generateFlashcards = formData.get('generateFlashcards') === 'true';
  const generateQuiz = formData.get('generateQuiz') === 'true';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не надано' }, { status: 400 });
  }

  const mime = file.type as SupportedMime;
  if (!SUPPORTED_MIME_TYPES.includes(mime)) {
    return NextResponse.json({ error: `Непідтримуваний тип файлу: ${file.type}` }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${user.id}/${Date.now()}-${file.name}`;

  console.log("Uploading to storage...");
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: mime,
    upsert: false,
  });
  console.log("File uploaded");
    if (uploadError) {
    console.log("ПОМИЛКА ЗАВАНТАЖЕННЯ:", uploadError);
  }
  

  let pack;
  try {
    pack = await prisma.pack.create({
      data: {
        userId: user.id,
        title: title || file.name.replace(/\.[^.]+$/, ''),
        sourceFile: path,
        sourceMime: mime,
        status: 'PROCESSING',
        generateNotes,
        generateFlashcards,
        generateQuiz,
      },
    });
    console.log("Pack created, id:", pack.id);
  } catch (dbError: any) {
    console.error("PRISMA CREATE ERROR:", dbError);
    return NextResponse.json({
      error: `DB Error: ${dbError.message}`,
      code: dbError.code,
      meta: dbError.meta
    }, { status: 500 });
  }

  let text = '';
  console.log("2. PARSING FILE...");
  try {
    text = await parseFile(buffer, mime);
  } catch (parseError) {
    console.error("DETAILED PACK ERROR:", parseError);
    await prisma.pack.update({
      where: { id: pack.id },
      data: {
        status: 'FAILED',
        errorMessage: `Parse error: ${(parseError as Error).message}`,
      },
    });
    return NextResponse.json({ error: `Failed to parse file: ${(parseError as Error).message}` }, { status: 500 });
  }

  // Check if text is too short
  if (text.length < 100) {
    await prisma.pack.update({
      where: { id: pack.id },
      data: {
        status: 'FAILED',
        errorMessage: 'Файл містить замало тексту',
      },
    });
    return NextResponse.json({ error: 'Файл містить замало тексту' }, { status: 500 });
  }

  // Generate AI pack
  let aiResult: GeneratedPack;
  console.log("3. AI GENERATION STARTED...");
  try {
    aiResult = await generatePack(text, generateNotes, generateFlashcards, generateQuiz);
  } catch (aiError) {
    console.error("DETAILED PACK ERROR:", aiError);
    await prisma.pack.update({
      where: { id: pack.id },
      data: {
        status: 'FAILED',
        errorMessage: (aiError as Error).message,
      },
    });
    return NextResponse.json({ error: (aiError as Error).message }, { status: 500 });
  }

  // Write notes, flashcards, and quiz questions to the database
  try {
    await prisma.$transaction(async (tx) => {
      if (generateNotes && aiResult.notes) {
        for (const note of aiResult.notes) {
          await tx.note.create({
            data: {
              packId: pack.id,
              title: note.title,
              content: note.content,
              order: 0,
            },
          });
        }
      }
      if (generateFlashcards && aiResult.flashcards) {
        for (const flashcard of aiResult.flashcards) {
          await tx.flashcard.create({
            data: {
              packId: pack.id,
              front: flashcard.front,
              back: flashcard.back,
              tags: flashcard.tags,
            },
          });
        }
      }
      if (generateQuiz && aiResult.quiz) {
        for (const quiz of aiResult.quiz) {
          await tx.quizQuestion.create({
            data: {
              packId: pack.id,
              question: quiz.question,
              options: quiz.options,
              correctIndex: quiz.correctIndex,
              explanation: quiz.explanation,
            },
          });
        }
      }
    });
  } catch (dbError) {
    console.error("DETAILED PACK ERROR:", dbError);
    await prisma.pack.update({
      where: { id: pack.id },
      data: {
        status: 'FAILED',
        errorMessage: (dbError as Error).message,
      },
    });
    return NextResponse.json({ error: (dbError as Error).message }, { status: 500 });
  }

  // Set status to READY
  await prisma.pack.update({
    where: { id: pack.id },
    data: { status: 'READY' },
  });

  // Повертаємо успішну відповідь
  return NextResponse.json({ id: pack.id });
}