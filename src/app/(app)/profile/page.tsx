import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, BookOpen, Brain, Zap, Settings, ArrowRight } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Отримуємо статистику користувача
  const totalPacks = await prisma.pack.count({ where: { userId: user.id } });
  const totalFlashcards = await prisma.flashcard.count({ where: { pack: { userId: user.id } } });
  const totalQuizzes = await prisma.quizQuestion.count({ where: { pack: { userId: user.id } } });

  // Безпечно отримуємо email (щоб TypeScript не сварився)
  const userEmail = user.email || 'no-email@example.com';
  const userName = user.user_metadata?.full_name || 'Студент';
  const userInitial = userName.charAt(0).toUpperCase();

  // Отримуємо дату реєстрації
  const joinedDate = new Date(user.created_at).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 max-w-4xl mx-auto font-mono min-h-[calc(100vh-4rem)]">
      
      <div className="mb-8 border-b border-black/10 pb-4">
        <h1 className="text-3xl font-bold">Мій профіль</h1>
        <p className="text-gray-500 mt-1">Особиста інформація та статистика</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Ліва колонка: Аватар та основна інфо */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white border-black/10 shadow-sm rounded-none">
            <CardContent className="p-6 flex flex-col items-center text-center">
              {/* Аватарка */}
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg shadow-indigo-600/20">
                {userInitial}
              </div>
              
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-sm text-gray-500 mb-4">@{userEmail.split('@')[0]}</p>
              
              <div className="w-full border-t border-black/5 pt-4 mt-2 space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{userEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>З нами з {joinedDate}</span>
                </div>
              </div>

              <Link href="/settings" className="w-full mt-6">
                <Button variant="outline" className="w-full rounded-none border-black/20 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-2" /> Редагувати профіль
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Права колонка: Статистика */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-black/10 shadow-sm rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-6 border-b border-black/5 pb-4">Твоя статистика</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 border border-black/5">
                  <BookOpen className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalPacks}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Пакетів</p>
                </div>
                <div className="text-center p-4 bg-gray-50 border border-black/5">
                  <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalFlashcards}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Карток</p>
                </div>
                <div className="text-center p-4 bg-gray-50 border border-black/5">
                  <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalQuizzes}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Тестів</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-indigo-900 mb-1">Продовжуй навчання!</h4>
                  <p className="text-sm text-indigo-700/70">Ти вже згенерував {totalFlashcards} карток. Час їх повторити.</p>
                </div>
                <Link href="/review">
                  <Button className="rounded-none bg-indigo-600 hover:bg-indigo-700 text-white">
                    До повторення <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}