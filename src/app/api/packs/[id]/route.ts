import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pack = await prisma.pack.findUnique({
    where: { id, userId: session.user.id },
    include: {
      notes: { orderBy: { order: 'asc' } },
      flashcards: true,
      quizQuestions: true,
    },
  });
  if (!pack) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ pack });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pack = await prisma.pack.findUnique({ where: { id, userId: session.user.id }, select: { sourceFile: true } });
  if (!pack) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.pack.delete({ where: { id, userId: session.user.id } });
  if (pack.sourceFile) {
    await supabase.storage.from('packs').remove([pack.sourceFile]);
  }

  return NextResponse.json({ success: true });
}
