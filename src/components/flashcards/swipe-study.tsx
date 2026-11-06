"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { motion, useAnimation, PanInfo } from "framer-motion";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function SwipeStudy({ cards, packId }: { cards: Flashcard[]; packId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<{ card: Flashcard; correct: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  
  const controls = useAnimation();
  const router = useRouter();

  const currentCard = cards[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    controls.set({ x: 0, rotate: 0, opacity: 1 });
  }, [currentIndex, controls]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      handleAnswer(true);
    } else if (info.offset.x < -swipeThreshold) {
      handleAnswer(false);
    } else {
      controls.start({ x: 0, rotate: 0 });
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    // Зберігаємо і картку, і результат
    setResults(prev => [...prev, { card: currentCard, correct: isCorrect }]);

    controls.start({
      x: isCorrect ? 500 : -500,
      rotate: isCorrect ? 20 : -20,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    });
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults([]);
    setIsFinished(false);
    setIsFlipped(false);
    setShowMistakes(false);
  };

  // Екран результатів
  if (isFinished) {
    const correctCount = results.filter(r => r.correct).length;
    const incorrectCount = results.length - correctCount;
    const mistakes = results.filter(r => !r.correct);

    // Якщо користувач натиснув "Переглянути помилки"
    if (showMistakes) {
      return (
        <div className="max-w-2xl mx-auto p-8 font-mono min-h-screen">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => setShowMistakes(false)} variant="outline" className="rounded-none">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад
            </Button>
            <h1 className="text-2xl font-bold">Твої помилки ({mistakes.length})</h1>
          </div>
          
          <div className="space-y-4">
            {mistakes.map((item, idx) => (
              <div key={idx} className="border border-red-100 bg-red-50/30 p-6 rounded-xl">
                <div className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wider">Питання</div>
                <h3 className="text-lg font-bold mb-4">{item.card.front}</h3>
                <div className="text-sm font-bold text-green-600 mb-2 uppercase tracking-wider">Правильна відповідь</div>
                <p className="text-gray-700">{item.card.back}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Button onClick={handleRestart} className="h-12 px-8 rounded-none bg-indigo-600 hover:bg-indigo-700">
              <RotateCcw className="w-4 h-4 mr-2" /> Пройти ще раз
            </Button>
          </div>
        </div>
      );
    }

    // Головний екран результатів
    return (
      <div className="max-w-2xl mx-auto p-8 text-center font-mono min-h-screen flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-2">Сесію завершено!</h1>
        <p className="text-gray-500 mb-12">Ось твої результати за цю сесію.</p>
        
        <div className="flex justify-center gap-12 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 mb-4">
              <Check className="w-12 h-12" />
            </div>
            <span className="text-3xl font-bold">{correctCount}</span>
            <span className="text-sm text-gray-500">Правильних</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
              <X className="w-12 h-12" />
            </div>
            <span className="text-3xl font-bold">{incorrectCount}</span>
            <span className="text-sm text-gray-500">Помилок</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
          {incorrectCount > 0 && (
            <Button 
              onClick={() => setShowMistakes(true)} 
              className="h-12 rounded-none bg-red-600 hover:bg-red-700 w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" /> Переглянути помилки
            </Button>
          )}
          <div className="flex gap-4 w-full">
            <Button onClick={handleRestart} variant="outline" className="h-12 rounded-none flex-1">
              <RotateCcw className="w-4 h-4 mr-2" /> Пройти ще раз
            </Button>
            <Button onClick={() => router.push(`/library/${packId}`)} className="h-12 rounded-none bg-indigo-600 hover:bg-indigo-700 flex-1">
              До пакету
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ... (решта коду для екрану свайпів залишається без змін)
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col font-mono bg-[#fafafa]">
      <div className="w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        <div className="absolute top-8 flex gap-8 text-sm font-bold text-gray-400">
          <span className="flex items-center gap-2 text-red-400"><ArrowLeft className="w-4 h-4"/> Не знаю</span>
          <span className="flex items-center gap-2 text-green-500">Знаю <ArrowRight className="w-4 h-4"/></span>
        </div>

        <div className="relative w-full max-w-md h-[400px] cursor-grab active:cursor-grabbing perspective-1000">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileDrag={{ scale: 1.05 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full absolute inset-0 rounded-3xl bg-white border border-black/10 shadow-xl flex items-center justify-center p-8 text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
              <span className="text-sm font-bold text-indigo-500 mb-4 block uppercase tracking-wider">Питання</span>
              <h2 className="text-2xl font-bold text-gray-900">{currentCard.front}</h2>
              <p className="text-xs text-gray-400 mt-8">Натисніть, щоб побачити відповідь</p>
            </div>
            
            <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-sm font-bold text-green-500 mb-4 block uppercase tracking-wider">Відповідь</span>
              <h2 className="text-xl font-medium text-gray-700">{currentCard.back}</h2>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-8 mt-12">
          <button 
            onClick={() => handleAnswer(false)}
            className="w-16 h-16 rounded-full bg-white border-2 border-red-100 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
          >
            <X className="w-8 h-8" />
          </button>
          <button 
            onClick={() => handleAnswer(true)}
            className="w-16 h-16 rounded-full bg-white border-2 border-green-100 text-green-500 flex items-center justify-center shadow-sm hover:bg-green-50 hover:border-green-300 transition-all active:scale-95"
          >
            <Check className="w-8 h-8" />
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Картка {currentIndex + 1} з {cards.length}
        </p>
      </div>
    </div>
  );
}