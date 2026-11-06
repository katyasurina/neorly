import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SwipeStudy from "@/components/flashcards/swipe-study";

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pack = await prisma.pack.findUnique({
    where: { id },
    include: { flashcards: true },
  });

  if (!pack || pack.flashcards.length === 0) {
    notFound();
  }

  return <SwipeStudy cards={pack.flashcards} packId={pack.id} />;
}