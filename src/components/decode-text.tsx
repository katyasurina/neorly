"use client";
import { useEffect, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function DecodeText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const animate = () => {
      interval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              if (char === " ") return " ";
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3; // швидкість анімації
      }, 30);
    };

    animate();
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText || text.replace(/./g, " ")}</span>;
}