import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scheduleCard } from "@/lib/srs/sm2";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rating } = await request.json();

    const card = await prisma.flashcard.findUnique({ where: { id } });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Викликаємо алгоритм SM-2
    const newState = scheduleCard(
      {
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
        dueAt: card.dueAt,
      },
      rating
    );

    // Оновлюємо картку в базі
    const updatedCard = await prisma.flashcard.update({
      where: { id },
      data: {
        easeFactor: newState.easeFactor,
        interval: newState.interval,
        repetitions: newState.repetitions,
        dueAt: newState.dueAt,
        lastReviewed: new Date(),
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("SM-2 UPDATE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}