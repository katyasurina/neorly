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
    if (!currentCard) return;

    setResults(prev => [...prev, { card: currentCard, correct: isCorrect }]);

    controls.start({
      x: isCorrect ? 500 : -500,
      rotate: isCorrect ? 20 : -20,
      opacity: 0,
      transition: { duration: 0.2 }
    }).then(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    });

    fetch(`/api/flashcards/${currentCard.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: isCorrect ? 3 : 1 }),
    }).catch(error => console.error("Помилка оновлення картки в фоні:", error));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults([]);
    setIsFinished(false);
    setIsFlipped(false);
    setShowMistakes(false);
  };

  if (isFinished) {
    const correctCount = results.filter(r => r.correct).length;
    const incorrectCount = results.length - correctCount;
    const mistakes = results.filter(r => !r.correct);

    if (showMistakes) {
      return (
        <div className="max-w-2xl mx-auto p-6 font-mono h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => setShowMistakes(false)} variant="outline" className="rounded-lg border-black/10 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад
            </Button>
            <h1 className="text-xl font-medium tracking-tight">Твої помилки ({mistakes.length})</h1>
          </div>
          
          <div className="space-y-4">
            {mistakes.map((item, idx) => (
              <div key={idx} className="bg-white border border-black/5 p-4 rounded-xl shadow-sm">
                <div className="text-[10px] font-bold text-red-500 mb-2 uppercase tracking-wider">Питання</div>
                <h3 className="text-sm font-medium mb-4 text-gray-900 leading-relaxed">{item.card.front}</h3>
                <div className="text-[10px] font-bold text-green-600 mb-2 uppercase tracking-wider">Правильна відповідь</div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.card.back}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center pb-8">
            <Button onClick={handleRestart} className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm">
              <RotateCcw className="w-4 h-4 mr-2" /> Пройти ще раз
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto p-6 text-center font-mono h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
        <h1 className="text-2xl font-medium mb-2">Сесію завершено!</h1>
        <p className="text-xs text-gray-500 mb-10">Ось твої результати за цю сесію.</p>
        
        <div className="flex justify-center gap-12 mb-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-green-50 border-2 border-green-500 flex items-center justify-center text-green-600 mb-3">
              <Check className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold">{correctCount}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Правильних</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-red-50 border-2 border-red-500 flex items-center justify-center text-red-600 mb-3">
              <X className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold">{incorrectCount}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Помилок</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
          {incorrectCount > 0 && (
            <Button 
              onClick={() => setShowMistakes(true)} 
              className="h-10 rounded-lg bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 w-full font-medium transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" /> Переглянути помилки
            </Button>
          )}
          <div className="flex gap-2 w-full">
            <Button onClick={handleRestart} variant="outline" className="h-10 rounded-lg flex-1 border-black/10 hover:bg-gray-50 font-medium text-sm">
              <RotateCcw className="w-4 h-4 mr-2" /> Пройти ще раз
            </Button>
            <Button onClick={() => router.push('/library')} className="h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex-1 font-medium text-white text-sm">
              До бібліотеки
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col font-mono bg-[#fafafa]">
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
        <div className="absolute top-6 flex gap-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-2 text-red-400/80"><ArrowLeft className="w-3 h-3"/> Не знаю</span>
          <span className="flex items-center gap-2 text-green-500/80">Знаю <ArrowRight className="w-3 h-3"/></span>
        </div>

        <div className="relative w-full max-w-md h-[320px] cursor-grab active:cursor-grabbing perspective-1000">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileDrag={{ scale: 1.02 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full absolute inset-0 rounded-2xl bg-white border border-black/5 shadow-xl flex items-center justify-center p-6 text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className={`transition-opacity duration-300 absolute inset-0 p-6 flex flex-col items-center justify-center ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-[10px] font-bold text-indigo-500 mb-4 block uppercase tracking-widest">Питання</span>
              <h2 className="text-lg md:text-xl font-medium text-gray-900 leading-snug">{currentCard.front}</h2>
              <p className="text-[10px] text-gray-400 mt-8">Натисніть, щоб побачити відповідь</p>
            </div>
            
            <div className={`absolute inset-0 p-6 flex flex-col items-center justify-center transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="text-[10px] font-bold text-green-500 mb-4 block uppercase tracking-widest">Відповідь</span>
              <h2 className="text-sm md:text-base font-normal text-gray-700 leading-relaxed">{currentCard.back}</h2>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-6 mt-8">
          <button 
            onClick={() => handleAnswer(false)}
            className="w-14 h-14 rounded-full bg-white border border-black/5 text-red-500 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-red-50 transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
          <button 
            onClick={() => handleAnswer(true)}
            className="w-14 h-14 rounded-full bg-white border border-black/5 text-green-500 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-green-50 transition-all active:scale-95"
          >
            <Check className="w-6 h-6" />
          </button>
        </div>

        <p className="mt-6 text-[10px] text-gray-400 font-mono uppercase tracking-wider">
          Картка {currentIndex + 1} з {cards.length}
        </p>
      </div>
    </div>
  );
}