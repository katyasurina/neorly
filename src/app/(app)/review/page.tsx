import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReviewStart from "@/components/review/review-start";
import { Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Знаходимо всі картки, які прострочені (dueAt <= зараз)
  // Беремо максимум 30, щоб не перевантажувати
  const cardsToReview = await prisma.flashcard.findMany({
    where: {
      pack: { userId: user.id },
      dueAt: { lte: new Date() },
    },
    take: 30,
  });

  if (cardsToReview.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto font-mono h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="bg-white border border-black/10 p-12 text-center shadow-sm max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
          <Brain className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Все повторено!</h1>
          <p className="text-gray-500 mb-8">
            На сьогодні у вас немає карток для повторення. Повертайтеся завтра!
          </p>
          <Link href="/library" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 transition-colors">
            До бібліотеки <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Передаємо картки у стартовий компонент
  return <ReviewStart cards={cardsToReview} />;
}