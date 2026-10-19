'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
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
