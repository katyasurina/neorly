"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, Brain, Zap, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [generateNotes, setGenerateNotes] = useState(true);
  const [generateFlashcards, setGenerateFlashcards] = useState(true);
  const [generateQuiz, setGenerateQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Стан для деталізації
  const [detailLevel, setDetailLevel] = useState(2);
  // Стан для кількості карток
  const [flashcardsCount, setFlashcardsCount] = useState("10");
  
  // Стан для прогресу
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ефект для анімації прогресу
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      setStatusText("Завантаження файлу...");
      
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          
          if (prev < 20) setStatusText("Зчитування тексту (PDF/DOCX)...");
          else if (prev < 60) setStatusText("Аналіз нейромережею...");
          else if (prev < 85) setStatusText("Генерація карток та тестів...");
          else setStatusText("Збереження результатів...");
          
          return prev + 2;
        });
      }, 1000);
    } else {
      setProgress(0);
      setStatusText("");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name.replace(/\.[^.]+$/, ""));
    formData.append("generateNotes", String(generateNotes));
    formData.append("generateFlashcards", String(generateFlashcards));
    formData.append("generateQuiz", String(generateQuiz));
    formData.append("detailLevel", String(detailLevel));
    formData.append("flashcardsCount", flashcardsCount);

    try {
      const res = await fetch("/api/packs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Помилка обробки файлу");
      }

      const data = await res.json();
      
      setProgress(100);
      setStatusText("Готово! Переходимо...");
      
      setTimeout(() => {
        router.push(`/library/${data.id}`);
      }, 500);

    } catch (error) {
      console.error(error);
      alert("Щось пішло не так. Спробуйте ще раз.");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-mono">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          Створити новий пакет
        </h1>
        <p className="text-gray-500">
          Завантаж PDF, DOCX, PPTX або TXT. Наш AI обробить його за секунди.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-black/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          <div className="relative flex items-center justify-center w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="stroke-gray-100" strokeWidth="8" fill="none" />
              <circle
                cx="50%" cy="50%" r="45%"
                className="stroke-indigo-600 transition-all duration-300 ease-out"
                strokeWidth="8" fill="none"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-black">{Math.round(progress)}%</span>
              <span className="text-xs text-gray-500 font-mono mt-1 uppercase">Progress</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 animate-pulse">{statusText}</h3>
          <p className="text-sm text-gray-400 max-w-xs text-center">
            Будь ласка, не закривайте цю сторінку. Це може зайняти до 2 хвилин.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">01 // Назва пакету</label>
            <Input
              placeholder="Наприклад: Історія України 9 клас"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 border-black/20 focus-visible:ring-indigo-600 rounded-none bg-white"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">02 // Що згенерувати?</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${generateNotes ? 'border-indigo-600 bg-indigo-50' : 'border-black/10 bg-white hover:border-black/30'}`}>
                <input 
                  type="checkbox" 
                  checked={generateNotes} 
                  onChange={(e) => setGenerateNotes(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div className="flex items-center gap-2">
                  <FileText className={`w-5 h-5 ${generateNotes ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Конспект</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${generateFlashcards ? 'border-indigo-600 bg-indigo-50' : 'border-black/10 bg-white hover:border-black/30'}`}>
                <input 
                  type="checkbox" 
                  checked={generateFlashcards} 
                  onChange={(e) => setGenerateFlashcards(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div className="flex items-center gap-2">
                  <Brain className={`w-5 h-5 ${generateFlashcards ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Флешкартки</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${generateQuiz ? 'border-indigo-600 bg-indigo-50' : 'border-black/10 bg-white hover:border-black/30'}`}>
                <input 
                  type="checkbox" 
                  checked={generateQuiz} 
                  onChange={(e) => setGenerateQuiz(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div className="flex items-center gap-2">
                  <Zap className={`w-5 h-5 ${generateQuiz ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Тести</span>
                </div>
              </label>
            </div>
          </div>

          {/* Блок налаштувань (з'являється залежно від вибору) */}
          <div className="space-y-6 pt-6 border-t border-black/10">
            
            {/* Повзунок деталізації */}
            {generateNotes && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">03 // Рівень деталізації конспекту</label>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${detailLevel === 1 ? 'font-bold text-indigo-600' : 'text-gray-400'}`}>Коротко</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="1"
                    value={detailLevel}
                    onChange={(e) => setDetailLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className={`text-sm ${detailLevel === 3 ? 'font-bold text-indigo-600' : 'text-gray-400'}`}>Детально</span>
                </div>
                <p className="text-xs text-gray-500">
                  {detailLevel === 1 && "Стислий переказ головних думок."}
                  {detailLevel === 2 && "Збалансований конспект із ключовими термінами."}
                  {detailLevel === 3 && "Розгорнутий конспект із прикладами та деталями."}
                </p>
              </div>
            )}

            {/* Вибір кількості карток */}
            {generateFlashcards && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Кількість флешкарток</label>
                <Select value={flashcardsCount} onValueChange={setFlashcardsCount}>
                  <SelectTrigger className="w-full h-12 rounded-none border-black/20 bg-white">
                    <SelectValue placeholder="Оберіть кількість" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 карток (швидко)</SelectItem>
                    <SelectItem value="15">15 карток</SelectItem>
                    <SelectItem value="20">20 карток (стандарт)</SelectItem>
                    <SelectItem value="25">25 карток (детально)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">04 // Файл</label>
            
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-black/20 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all cursor-pointer h-64 flex flex-col items-center justify-center bg-white group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-1">Перетягніть файл сюди</p>
                <p className="text-sm text-gray-500 mb-4">або натисніть, щоб вибрати з комп'ютера</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                  PDF, DOCX, PPTX, TXT (до 50 MB)
                </span>
              </div>
            ) : (
              <div className="border border-indigo-200 bg-indigo-50 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-indigo-900">{file.name}</p>
                    <p className="text-xs text-indigo-600 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-indigo-400 hover:text-red-500 transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx,.pptx,.txt"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!file}
            className="w-full h-14 text-lg font-bold rounded-none bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Згенерувати пакет
          </Button>
        </form>
      )}
    </div>
  );
}