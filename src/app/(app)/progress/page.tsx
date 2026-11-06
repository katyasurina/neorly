import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import ActivityChart from '@/components/dashboard/activity-chart';

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Отримуємо загальну кількість карток та пакетів
  const totalFlashcards = await prisma.flashcard.count({ where: { pack: { userId: user.id } } });
  const totalPacks = await prisma.pack.count({ where: { userId: user.id } });
  
  // Дані для графіка (поки що фейкові, але структура готова)
  const chartData = [
    { name: 'Пн', packs: 2 }, { name: 'Вт', packs: 5 }, { name: 'Ср', packs: 3 },
    { name: 'Чт', packs: 8 }, { name: 'Пт', packs: 6 }, { name: 'Сб', packs: 10 }, { name: 'Нд', packs: 4 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto font-mono min-h-[calc(100vh-4rem)]">
      
      <div className="mb-8 border-b border-black/10 pb-4">
        <h1 className="text-3xl font-bold">Твій прогрес</h1>
        <p className="text-gray-500 mt-1">Аналітика твого навчання та статистика</p>
      </div>

      {/* Картки зі статистикою */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">{totalFlashcards}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Всього карток</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Днів поспіль</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">85%</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Середній бал</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm rounded-none">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">{totalPacks}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Пакетів створено</p>
          </CardContent>
        </Card>
      </div>

      {/* Великий графік */}
      <div className="bg-white border border-black/10 p-6 shadow-sm mb-8">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Активність за тиждень</h3>
        <div className="h-64">
          <ActivityChart data={chartData} />
        </div>
      </div>

      {/* Прогрес по пакетах (Таблиця) */}
      <div className="bg-white border border-black/10 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Прогрес по пакетах</h3>
        <div className="space-y-4">
          {/* Тут буде список пакетів */}
          <div className="flex items-center justify-between p-4 border border-black/5 bg-gray-50">
            <div>
              <h4 className="font-bold">Історія України</h4>
              <p className="text-xs text-gray-500">24 картки</p>
            </div>
            <div className="w-1/3 bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <span className="text-sm font-bold text-indigo-600">75%</span>
          </div>
        </div>
      </div>

    </div>
  );
}