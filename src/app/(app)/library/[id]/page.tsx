import { prisma } from '@/lib/prisma';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import FlashcardCard from '@/components/flashcards/flashcard-card';
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
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2">Пакет не знайдено</h2>
        <p className="text-muted-foreground">Цей пакет не існує або не належить вам.</p>
      </div>
    );
  }

  if (pack.status === 'FAILED') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2 text-destructive">Помилка обробки</h2>
        <p className="text-muted-foreground">{pack.errorMessage || 'Невідома помилка.'}</p>
      </div>
    );
  }

  if (pack.status !== 'READY') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2">Обробка йде...</h2>
        <p className="text-muted-foreground">Статус: {pack.status}</p>
      </div>
    );
  }

  const hasNotes = Array.isArray(pack.notes) && pack.notes.length > 0;
  const hasFlashcards = Array.isArray(pack.flashcards) && pack.flashcards.length > 0;
  const hasQuiz = Array.isArray(pack.quizQuestions) && pack.quizQuestions.length > 0;

  // Об'єднуємо всі конспекти в один суцільний текст
  const fullNotesContent = hasNotes 
    ? pack.notes.map(note => note.content).join('\n\n') 
    : '';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{pack.title}</h1>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="notes">Конспект</TabsTrigger>
          <TabsTrigger value="flashcards">Флешкартки</TabsTrigger>
          <TabsTrigger value="quiz">Тести</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          {hasNotes ? (
            <div className="rounded-lg border bg-card p-6 shadow-sm prose prose-sm md:prose-base max-w-none dark:prose-invert">
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
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Режим навчання</h3>
                  <p className="text-sm text-indigo-700/70">Перевірте свої знання за допомогою свайпів.</p>
                </div>
                <Link 
                  href={`/library/${pack.id}/study`} 
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 font-bold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  Почати навчання
                </Link>
              </div>

              {/* Сітка карток для перегляду */}
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
            <div className="space-y-6">
              {pack.quizQuestions.map((q, idx) => (
                <article key={q.id} className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    {idx + 1}. {q.question}
                  </h3>
                  <ul className="space-y-2">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={`rounded-md border px-4 py-3 text-sm ${
                          i === q.correctIndex
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-muted'
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  {q.explanation && (
                    <p className="mt-3 text-sm text-muted-foreground">{q.explanation}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Тести ще не згенеровано.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}