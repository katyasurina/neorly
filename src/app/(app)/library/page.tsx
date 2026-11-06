import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { FileText, ArrowRight } from 'lucide-react';

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const packs = await prisma.pack.findMany({
    where: { 
      userId: user.id,
      status: 'READY'
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { notes: true, flashcards: true, quizQuestions: true }
      }
    }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Заголовок сторінки (звичайний шрифт) */}
      <div className="flex justify-between items-center mb-10 border-b border-black/10 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Моя бібліотека</h1>
          <p className="text-sm text-gray-500 mt-1">Всі ваші збережені матеріали</p>
        </div>
      </div>

      {packs.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-black/10 rounded-xl bg-white/50">
          <FileText className="mx-auto h-10 w-10 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-1">У вас ще немає матеріалів</h3>
          <p className="text-sm text-gray-500 mb-6">Завантажте свій перший файл, щоб почати навчання.</p>
          <Link href="/upload" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white h-10 px-5 text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Завантажити файл <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <Link key={pack.id} href={`/library/${pack.id}`}>
              <Card className="h-full hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer rounded-xl border-black/5 bg-white overflow-hidden group">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {pack.title}
                  </h3>
                  
                  <div className="flex gap-2 flex-wrap">
                    {pack._count.notes > 0 && (
                      <span className="text-[11px] font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 text-gray-600 rounded">Конспект</span>
                    )}
                    {pack._count.flashcards > 0 && (
                      <span className="text-[11px] font-mono bg-indigo-50/50 border border-indigo-100 px-2 py-0.5 text-indigo-700 rounded">Картки: {pack._count.flashcards}</span>
                    )}
                    {pack._count.quizQuestions > 0 && (
                      <span className="text-[11px] font-mono bg-green-50/50 border border-green-100 px-2 py-0.5 text-green-700 rounded">Тести: {pack._count.quizQuestions}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}