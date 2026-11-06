"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Brain } from "lucide-react";
import SwipeStudy from "@/components/flashcards/swipe-study";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function ReviewStart({ cards }: { cards: Flashcard[] }) {
  const [isStarted, setIsStarted] = useState(false);
  const [cardCount, setCardCount] = useState("10");

  if (isStarted) {
    const selectedCards = cards.slice(0, parseInt(cardCount));
    return <SwipeStudy cards={selectedCards} packId="review" />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#fafafa] font-mono flex flex-col items-center justify-center p-6">
      <div className="bg-white border border-black/10 p-8 md:p-10 text-center shadow-sm max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        
        {/* Зменшена іконка */}
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <Brain className="w-8 h-8" />
        </div>

        {/* Зменшений заголовок */}
        <h1 className="text-2xl font-bold mb-3 text-black">Інтервальне повторення</h1>
        
        {/* Зменшений текст */}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Тут зібрані картки з усіх твоїх пакетів, час яких настав повторити. 
          Це найефективніший спосіб запам'ятати матеріал надовго.
        </p>

        <div className="space-y-3 mb-6 text-left bg-gray-50 p-5 border border-black/5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Скільки карток повторити?</label>
          <Select value={cardCount} onValueChange={setCardCount}>
            <SelectTrigger className="w-full h-10 rounded-none border-black/20 bg-white">
              <SelectValue placeholder="Оберіть кількість" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 карток (швидко)</SelectItem>
              <SelectItem value="15">15 карток</SelectItem>
              <SelectItem value="20">20 карток (стандарт)</SelectItem>
              <SelectItem value="25">25 карток</SelectItem>
              <SelectItem value="30">30 карток (детально)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-gray-400 mt-2">
            Доступно для повторення: <span className="font-bold text-black">{cards.length}</span> карток.
          </p>
        </div>

        {/* Зменшена кнопка */}
        <Button 
          onClick={() => setIsStarted(true)} 
          className="w-full h-12 text-base font-bold rounded-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
        >
          <Play className="w-4 h-4 mr-2" /> Почати повторення
        </Button>
      </div>
    </div>
  );
}