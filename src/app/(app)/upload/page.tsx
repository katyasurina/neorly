'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [packTitle, setPackTitle] = useState('');
  const [generateNotes, setGenerateNotes] = useState(true);
  const [generateFlashcards, setGenerateFlashcards] = useState(true);
  const [generateQuiz, setGenerateQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('title', packTitle || file.name.replace(/\.[^.]+$/, ''));
    form.append('generateNotes', String(generateNotes));
    form.append('generateFlashcards', String(generateFlashcards));
    form.append('generateQuiz', String(generateQuiz));
    try {
      const res = await fetch('/api/packs', { method: 'POST', body: form });
      const data = await res.json();
      if (data.id) router.push(`/library/${data.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Завантажити матеріал</h2>
      <p className="text-muted-foreground">PDF, DOCX, PPTX або TXT — ми створимо пакет для навчання.</p>

      <div className="space-y-3">
        <Input
          placeholder="Введіть назву (наприклад, Історія 9 клас)"
          value={packTitle}
          onChange={(e) => setPackTitle(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={generateNotes}
              onChange={(e) => setGenerateNotes(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span>Згенерувати конспект</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={generateFlashcards}
              onChange={(e) => setGenerateFlashcards(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span>Згенерувати флешкартки</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={generateQuiz}
              onChange={(e) => setGenerateQuiz(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span>Згенерувати тести</span>
          </label>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-muted rounded-xl p-12 flex flex-col items-center gap-3 transition-colors hover:border-foreground/30"
      >
        <UploadCloud className="size-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Перетягніть файл або оберіть вручну</p>
        <input type="file" onChange={handleFileInput} className="hidden" id="file" />
        <label htmlFor="file" className="cursor-pointer text-sm text-primary hover:underline">Обрати файл</label>
        {file && (
          <div className="flex items-center gap-2 text-sm font-medium mt-2">
            <FileText className="size-4" />
            {file.name}
          </div>
        )}
      </div>
      {file && (
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? 'Обробка...' : 'Обробити'}
        </Button>
      )}
    </div>
  );
}
