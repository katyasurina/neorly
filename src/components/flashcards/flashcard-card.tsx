"use client";

import React from 'react';

export default function FlashcardCard({ card }: { card: { id: string; front: string; back: string } }) {
  return (
    <button
      className="group relative rounded-xl border bg-card p-6 text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
      onClick={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        const back = el.querySelector('.back-text') as HTMLSpanElement;
        const front = el.querySelector('.front-text') as HTMLSpanElement;
        if (back && front) {
          const isHidden = back.style.display === 'none';
          back.style.display = isHidden ? 'block' : 'none';
          front.style.display = isHidden ? 'none' : 'block';
        }
      }}
      type="button"
    >
      <span className="front-text block text-lg font-medium leading-snug">{card.front}</span>
      <span className="back-text hidden text-lg font-medium leading-snug text-muted-foreground">{card.back}</span>
      <span className="mt-3 block text-xs text-muted-foreground">Натисніть, щоб показати відповідь</span>
    </button>
  );
}
