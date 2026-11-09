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

    const handleAnswer = async (isCorrect: boolean) => {
    // ЗАХИСТ: Якщо картки вже немає (наприклад, подвійний клік), зупиняємося
    if (!currentCard) return;

    // Зберігаємо результат
    setResults(prev => [...prev, { card: currentCard, correct: isCorrect }]);

    // Оновлюємо картку в базі (SM-2)
    try {
      await fetch(`/api/flashcards/${currentCard.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: isCorrect ? 3 : 1 }), // 3 - Good, 1 - Again
      });
    } catch (error) {
      console.error("Помилка оновлення картки:", error);
    }

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

    if (showMistakes) {
      return (
        <div className="max-w-2xl mx-auto p-8 font-mono h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-4 mb-10">
            <Button onClick={() => setShowMistakes(false)} variant="outline" className="rounded-lg border-black/10 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад
            </Button>
            <h1 className="text-2xl font-medium tracking-tight">Твої помилки ({mistakes.length})</h1>
          </div>
          
          <div className="space-y-6">
            {mistakes.map((item, idx) => (
              <div key={idx} className="bg-white border border-black/5 p-6 rounded-xl shadow-sm">
                <div className="text-[11px] font-bold text-red-500 mb-3 uppercase tracking-wider">Питання</div>
                <h3 className="text-base font-medium mb-6 text-gray-900 leading-relaxed">{item.card.front}</h3>
                <div className="text-[11px] font-bold text-green-600 mb-3 uppercase tracking-wider">Правильна відповідь</div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.card.back}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center pb-12">
            <Button onClick={handleRestart} className="h-12 px-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              <RotateCcw className="w-4 h-4 mr-2" /> Пройти ще раз
            </Button>
          </div>
        </div>
      );
    }

    // Головний екран результатів
    return (
      <div className="max-w-2xl mx-auto p-8 text-center font-mono h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
        <h1 className="text-3xl font-medium mb-3">Сесію завершено!</h1>
        <p className="text-sm text-gray-500 mb-16">Ось твої результати за цю сесію.</p>
        
        <div className="flex justify-center gap-16 mb-16">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-green-50 border-2 border-green-500 flex items-center justify-center text-green-600 mb-4">
              <Check className="w-10 h-10" />
            </div>
            <span className="text-3xl font-semibold">{correctCount}</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Правильних</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-red-50 border-2 border-red-500 flex items-center justify-center text-red-600 mb-4">
              <X className="w-10 h-10" />
            </div>
            <span className="text-3xl font-semibold">{incorrectCount}</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Помилок</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
          {incorrectCount > 0 && (
            <Button 
              onClick={() => setShowMistakes(true)} 
              className="h-12 rounded-lg bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 w-full font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" /> Переглянути помилки
            </Button>
          )}
          <div className="flex gap-3 w-full">
            <Button onClick={handleRestart} variant="outline" className="h-12 rounded-lg flex-1 border-black/10 hover:bg-gray-50 font-medium">
              <RotateCcw className="w-4 h-4 mr-2" /> Пройти ще раз
            </Button>
            <Button onClick={() => router.push('/library')} className="h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex-1 font-medium text-white">
              До бібліотеки
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Екран свайпів
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col font-mono bg-[#fafafa]">
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        <div className="absolute top-10 flex gap-12 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-2 text-red-400/80"><ArrowLeft className="w-4 h-4"/> Не знаю</span>
          <span className="flex items-center gap-2 text-green-500/80">Знаю <ArrowRight className="w-4 h-4"/></span>
        </div>

        <div className="relative w-full max-w-md h-[420px] cursor-grab active:cursor-grabbing perspective-1000">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileDrag={{ scale: 1.02 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full absolute inset-0 rounded-2xl bg-white border border-black/5 shadow-xl flex items-center justify-center p-10 text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className={`transition-opacity duration-300 absolute inset-0 p-10 flex flex-col items-center justify-center ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-[11px] font-bold text-indigo-500 mb-6 block uppercase tracking-widest">Питання</span>
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 leading-snug">{currentCard.front}</h2>
              <p className="text-xs text-gray-400 mt-12">Натисніть, щоб побачити відповідь</p>
            </div>
            
            <div className={`absolute inset-0 p-10 flex flex-col items-center justify-center transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="text-[11px] font-bold text-green-500 mb-6 block uppercase tracking-widest">Відповідь</span>
              <h2 className="text-base md:text-lg font-normal text-gray-700 leading-relaxed">{currentCard.back}</h2>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-8 mt-14">
          <button 
            onClick={() => handleAnswer(false)}
            className="w-16 h-16 rounded-full bg-white border border-black/5 text-red-500 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-red-50 transition-all active:scale-95"
          >
            <X className="w-7 h-7" />
          </button>
          <button 
            onClick={() => handleAnswer(true)}
            className="w-16 h-16 rounded-full bg-white border border-black/5 text-green-500 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-green-50 transition-all active:scale-95"
          >
            <Check className="w-7 h-7" />
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-400 font-mono uppercase tracking-wider">
          Картка {currentIndex + 1} з {cards.length}
        </p>
      </div>
    </div>
  );
}