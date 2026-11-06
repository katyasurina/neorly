import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Zap, ArrowRight, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Отримуємо статистику з бази
  const packs = await prisma.pack.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3, // Беремо 3 останні
    include: {
      _count: { select: { notes: true, flashcards: true, quizQuestions: true } }
    }
  });

  const totalPacks = await prisma.pack.count({ where: { userId: user.id } });
  const totalFlashcards = await prisma.flashcard.count({ where: { pack: { userId: user.id } } });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Привітання */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Вітаємо, {user.user_metadata?.full_name || 'Студент'}! 👋</h1>
        <p className="text-gray-500">Ось огляд твого навчального прогресу на сьогодні.</p>
      </div>

      {/* Картки зі статистикою */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-indigo-50 border-indigo-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900">Всього пакетів</p>
              <h3 className="text-2xl font-bold text-indigo-900">{totalPacks}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Флешкарток</p>
              <h3 className="text-2xl font-bold text-blue-900">{totalFlashcards}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-700">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Днів поспіль</p>
              <h3 className="text-2xl font-bold text-green-900">1</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Останні пакети */}
      <div className="pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Останні матеріали</h2>
          <Link href="/library" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            Всі матеріали <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {packs.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card">
            <Zap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Тут поки що порожньо</h3>
            <p className="text-gray-500 mb-4">Завантаж свій перший файл, щоб почати навчання.</p>
            <Link href="/upload">
              <Button>Завантажити файл</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <Link key={pack.id} href={`/library/${pack.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{pack.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap mt-2 text-xs text-gray-500">
                      {pack._count.notes > 0 && <span className="bg-gray-100 px-2 py-1 rounded">Конспект</span>}
                      {pack._count.flashcards > 0 && <span className="bg-gray-100 px-2 py-1 rounded">Картки: {pack._count.flashcards}</span>}
                      {pack._count.quizQuestions > 0 && <span className="bg-gray-100 px-2 py-1 rounded">Тести: {pack._count.quizQuestions}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}