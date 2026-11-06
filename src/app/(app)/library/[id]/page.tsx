import { prisma } from '@/lib/prisma';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import FlashcardCard from '@/components/flashcards/flashcard-card';
import InteractiveQuiz from '@/components/quiz/interactive-quiz';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pack = await prisma.pack.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { order: 'asc' } },
      flashcards: true,
      quizQuestions: true,
    },
  });

  if (!pack) {
    return (
      <div className="p-8 font-mono">
        <h2 className="text-2xl font-bold mb-2">Пакет не знайдено</h2>
        <p className="text-muted-foreground">Цей пакет не існує або не належить вам.</p>
      </div>
    );
  }

  if (pack.status === 'FAILED') {
    return (
      <div className="p-8 font-mono">
        <h2 className="text-2xl font-bold mb-2 text-destructive">Помилка обробки</h2>
        <p className="text-muted-foreground">{pack.errorMessage || 'Невідома помилка.'}</p>
      </div>
    );
  }

  if (pack.status !== 'READY') {
    return (
      <div className="p-8 font-mono">
        <h2 className="text-2xl font-bold mb-2">Обробка йде...</h2>
        <p className="text-muted-foreground">Статус: {pack.status}</p>
      </div>
    );
  }

  const hasNotes = Array.isArray(pack.notes) && pack.notes.length > 0;
  const hasFlashcards = Array.isArray(pack.flashcards) && pack.flashcards.length > 0;
  const hasQuiz = Array.isArray(pack.quizQuestions) && pack.quizQuestions.length > 0;

  const fullNotesContent = hasNotes 
    ? pack.notes.map(note => note.content).join('\n\n') 
    : '';

  return (
    <div className="min-h-screen bg-[#fafafa] relative p-8 font-mono">
      {/* Сітка на фоні */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{pack.title}</h1>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="mb-8 bg-white border border-black/10 p-1 rounded-none h-auto">
            <TabsTrigger value="notes" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-2">Конспект</TabsTrigger>
            <TabsTrigger value="flashcards" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-2">Флешкартки</TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-none data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-2">Тести</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            {hasNotes ? (
              <div className="bg-white border border-black/10 p-8 shadow-sm prose prose-sm md:prose-base max-w-none dark:prose-invert">
                <ReactMarkdown>{fullNotesContent}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground">Конспект ще не згенеровано.</p>
            )}
          </TabsContent>

          <TabsContent value="flashcards">
            {hasFlashcards ? (
              <div className="space-y-6">
                {/* Кнопка запуску свайпів */}
                <div className="bg-white border border-black/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                  <div>
                    <h3 className="text-lg font-bold text-black">Режим навчання</h3>
                    <p className="text-sm text-gray-500">Перевірте свої знання за допомогою свайпів.</p>
                  </div>
                  <Link 
                    href={`/library/${pack.id}/study`} 
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 transition-colors shadow-sm w-full md:w-auto"
                  >
                    <Play className="w-4 h-4" />
                    Почати навчання
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {pack.flashcards.map((card) => (
                    <FlashcardCard key={card.id} card={card} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Флешкартки ще не згенеровано.</p>
            )}
          </TabsContent>

          <TabsContent value="quiz">
            {hasQuiz ? (
              <InteractiveQuiz questions={pack.quizQuestions} packId={pack.id} />
            ) : (
              <p className="text-muted-foreground">Тести ще не згенеровано.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}