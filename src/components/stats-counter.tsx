"use client";
import { useEffect, useState, useRef } from "react";

export default function StatsCounter() {
  const [progress, setProgress] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true); // Запускаємо анімацію, тільки коли побачили блок
        }
      },
      { threshold: 0.5 } // Спрацює, коли блок з'явиться на 50% у полі зору
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    // Анімація цифр
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start <= 85) setProgress(start);
      if (start <= 35) setEfficiency(Number((start / 10).toFixed(1)));
      if (start > 85) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [hasStarted]);

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mt-12 mb-8">
      
      {/* Круговий прогрес */}
      <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-gray-200"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-indigo-600 transition-all duration-1000 ease-out"
            strokeWidth="8"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold text-black">{progress}%</span>
          <span className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest uppercase">Score</span>
        </div>
      </div>

      {/* Цифра ефективності */}
      <div className="flex flex-col items-center">
        <span className="text-5xl md:text-7xl font-bold text-indigo-600 tracking-tighter">
          {efficiency}x
        </span>
        <span className="text-sm md:text-base text-gray-500 font-mono mt-2 uppercase tracking-wider">Ефективність</span>
      </div>

    </div>
  );
}