import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SUPPORTED_MIME_TYPES, SupportedMime } from '@/lib/parsers';

export const runtime = 'nodejs';

const BUCKET = 'packs';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const packs = await prisma.pack.findMany({
    where: { userId: session.user.id },
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
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не надано' }, { status: 400 });
  }

  const mime = file.type as SupportedMime;
  if (!SUPPORTED_MIME_TYPES.includes(mime)) {
    return NextResponse.json({ error: `Непідтримуваний тип файлу: ${file.type}` }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${session.user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: mime,
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ error: `Помилка завантаження: ${uploadError.message}` }, { status: 500 });
  }

  const pack = await prisma.pack.create({
    data: {
      userId: session.user.id,
      title: file.name.replace(/\.[^.]+$/, ''),
      sourceFile: path,
      sourceMime: mime,
      status: 'PROCESSING',
    },
  });

  // TODO: next step — parse file, call AI generation, write notes/flashcards/quiz, set status READY.

  return NextResponse.json({ id: pack.id });
}
