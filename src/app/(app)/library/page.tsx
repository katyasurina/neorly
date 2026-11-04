import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const packs = await prisma.pack.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { notes: true, flashcards: true, quizQuestions: true }
      }
    }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Моя бібліотека</h1>
          <p className="text-muted-foreground mt-1">Всі ваші збережені матеріали</p>
        </div>
      </div>

      {packs.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">У вас ще немає матеріалів</h3>
          <p className="text-muted-foreground mb-4">Завантажте свій перший файл, щоб почати навчання.</p>
          <Link href="/upload" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2 hover:bg-primary/90">
            Завантажити файл
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <Link key={pack.id} href={`/library/${pack.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{pack.title}</CardTitle>
                    {pack.status === 'READY' && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
                    {pack.status === 'PROCESSING' && <Clock className="h-5 w-5 text-yellow-500 shrink-0" />}
                    {pack.status === 'FAILED' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
                  </div>
                  <CardDescription>
                    {new Date(pack.createdAt).toLocaleDateString('uk-UA')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {pack._count.notes > 0 && <Badge variant="secondary">Конспект</Badge>}
                    {pack._count.flashcards > 0 && <Badge variant="secondary">Картки: {pack._count.flashcards}</Badge>}
                    {pack._count.quizQuestions > 0 && <Badge variant="secondary">Тести: {pack._count.quizQuestions}</Badge>}
                    {pack.status === 'PROCESSING' && <Badge variant="outline">Обробка...</Badge>}
                    {pack.status === 'FAILED' && <Badge variant="destructive">Помилка</Badge>}
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