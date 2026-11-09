import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Zap, ArrowRight, TrendingUp, Sparkles, RotateCcw, Award } from 'lucide-react';
import ActivityChart from '@/components/dashboard/activity-chart';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const packs = await prisma.pack.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      _count: { select: { notes: true, flashcards: true, quizQuestions: true } }
    }
  });

  const totalPacks = await prisma.pack.count({ where: { userId: user.id } });
  const totalFlashcards = await prisma.flashcard.count({ where: { pack: { userId: user.id } } });
  
  const cardsToReviewCount = await prisma.flashcard.count({
    where: {
      pack: { userId: user.id },
      dueAt: { lte: new Date() },
    },
  });

  const allPacks = await prisma.pack.findMany({
    where: { userId: user.id },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' }
  });
  
  const uniqueDays = new Set(allPacks.map(p => p.createdAt.toISOString().split('T')[0])).size;

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = allPacks.filter(p => p.createdAt.toISOString().split('T')[0] === dateStr).length;
    chartData.push({
      name: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
      packs: count,
    });
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto font-mono min-h-[calc(100vh-4rem)] flex flex-col">
      
      {/* Привітання */}
      <div className="bg-white border border-black/10 p-6 shadow-sm relative overflow-hidden shrink-0 mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Вітаємо, {user.user_metadata?.full_name || 'Студент'}!
        </h1>
        <p className="text-sm text-gray-500">Ось огляд твого навчального прогресу на сьогодні.</p>
      </div>

      {/* Картки зі статистикою (адаптивні) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0 mb-6">
        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-3 md:p-5 flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Пакетів</p>
            <h3 className="text-xl md:text-3xl font-bold text-black mb-2">{totalPacks}</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-3 md:p-5 flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Карток</p>
            <h3 className="text-xl md:text-3xl font-bold text-black mb-2">{totalFlashcards}</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Brain className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-3 md:p-5 flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Днів</p>
            <h3 className="text-xl md:text-3xl font-bold text-black mb-2">{uniqueDays}</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </CardContent>
        </Card>

        <Link href="/review" className="h-full">
          <Card className="bg-white border-black/10 shadow-sm rounded-none hover:border-red-200 transition-colors cursor-pointer h-full">
            <CardContent className="p-3 md:p-5 flex flex-col items-center text-center md:items-start md:text-left">
              <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">До повтору</p>
              <h3 className="text-xl md:text-3xl font-bold text-red-600 mb-2">{cardsToReviewCount}</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 flex-1">
        {/* Графік */}
        <div className="lg:col-span-2 bg-white border border-black/10 p-4 md:p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Твоя активність</h3>
          <div className="flex-1 min-h-[200px]">
            <ActivityChart data={chartData} />
          </div>
        </div>

        {/* Останні пакети */}
        <div className="bg-white border border-black/10 p-4 md:p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2 shrink-0">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Останні</h2>
            <Link href="/library" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Всі <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-3 overflow-y-auto">
            {packs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Порожньо</p>
            ) : (
              packs.map((pack) => (
                <Link key={pack.id} href={`/library/${pack.id}`}>
                  <div className="p-3 border border-black/5 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                    <h3 className="text-sm font-bold mb-1 line-clamp-1">{pack.title}</h3>
                    <div className="flex gap-2 flex-wrap text-[10px] text-gray-500 mt-2">
                      {pack._count.notes > 0 && (
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">Конспект</span>
                      )}
                      {pack._count.flashcards > 0 && (
                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">Картки: {pack._count.flashcards}</span>
                      )}
                      {pack._count.quizQuestions > 0 && (
                        <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded">Тести: {pack._count.quizQuestions}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}