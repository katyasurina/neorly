"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, ArrowLeft, RotateCcw, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
}

export default function InteractiveQuiz({ questions, packId }: { questions: QuizQuestion[]; packId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<{ question: QuizQuestion; selected: number; correct: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  const router = useRouter();
  const currentQuestion = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    
    setResults((prev) => {
      const existingIndex = prev.findIndex((r) => r.question.id === currentQuestion.id);
      const newResult = { question: currentQuestion, selected: index, correct: isCorrect };
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newResult;
        return updated;
      }
      return [...prev, newResult];
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      const nextResult = results.find(r => r.question.id === questions[nextIndex].id);
      if (nextResult) {
        setSelectedOption(nextResult.selected);
        setIsAnswered(true);
      } else {
        setSelectedOption(null);
        setIsAnswered(false);
      }
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      
      const prevResult = results.find(r => r.question.id === questions[prevIndex].id);
      if (prevResult) {
        setSelectedOption(prevResult.selected);
        setIsAnswered(true);
      } else {
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setResults([]);
    setIsFinished(false);
    setShowMistakes(false);
  };

  if (isFinished) {
    const correctCount = results.filter((r) => r.correct).length;
    const incorrectCount = results.length - correctCount;
    const percentage = Math.round((correctCount / questions.length) * 100);

    if (showMistakes) {
      return (
        <div className="max-w-2xl mx-auto p-6 font-mono h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => setShowMistakes(false)} variant="outline" className="rounded-lg border-black/10 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад
            </Button>
            <h1 className="text-xl font-medium tracking-tight">Твої помилки ({incorrectCount})</h1>
          </div>
          
          <div className="space-y-4">
            {results.filter(r => !r.correct).map((item, idx) => (
              <div key={idx} className="bg-white border border-black/5 p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-medium mb-3 text-gray-900 leading-relaxed">{item.question.question}</h3>
                <div className="text-xs text-red-600 mb-1">Твоя відповідь: {item.question.options[item.selected]}</div>
                <div className="text-xs text-green-600">Правильна відповідь: {item.question.options[item.question.correctIndex]}</div>
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
        <h1 className="text-2xl font-medium mb-2">Тест завершено!</h1>
        <p className="text-xs text-gray-500 mb-10">Ось твої результати.</p>
        
        <div className="flex justify-center gap-12 mb-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-green-50 border-2 border-green-500 flex items-center justify-center text-green-600 mb-3">
              <Check className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold">{correctCount} з {questions.length}</span>
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

        <div className="text-3xl font-bold mb-8 text-indigo-600">{percentage}%</div>

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
            <Button onClick={() => router.push(`/library/${packId}`)} className="h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex-1 font-medium text-white text-sm">
              До пакету
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 font-mono h-[calc(100vh-4rem)] flex flex-col">
      <div className="w-full h-1 bg-gray-100 mb-6 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Питання {currentIndex + 1} з {questions.length}
          </div>
          <h2 className="text-lg md:text-xl font-medium text-gray-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full text-left p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";
            
            if (!isAnswered) {
              buttonClass += "border-black/10 bg-white hover:border-indigo-300 hover:bg-indigo-50/30";
            } else if (index === currentQuestion.correctIndex) {
              buttonClass += "border-green-500 bg-green-50 text-green-900";
            } else if (index === selectedOption) {
              buttonClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              buttonClass += "border-black/5 bg-gray-50 text-gray-400 opacity-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span className="font-medium text-sm">{option}</span>
                {isAnswered && index === currentQuestion.correctIndex && (
                  <Check className="w-4 h-4 text-green-600 shrink-0 ml-3" />
                )}
                {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && (
                  <X className="w-4 h-4 text-red-600 shrink-0 ml-3" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && currentQuestion.explanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gray-50 border-l-2 border-indigo-500 text-xs text-gray-600"
          >
            {currentQuestion.explanation}
          </motion.div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center pt-4 border-t border-black/10">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="rounded-lg border-black/10 h-9 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад
        </Button>

        <Button 
          onClick={handleNext}
          disabled={!isAnswered}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 font-medium px-6 text-white h-9 text-sm"
        >
          {currentIndex === questions.length - 1 ? "Завершити" : "Далі"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}