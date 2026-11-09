"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ExportButton({ title, content }: { title: string; content: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!componentRef.current) return;
    setIsExporting(true);

    try {
      // Динамічний імпорт, бо бібліотека працює тільки в браузері
      const html2pdf = (await import("html2pdf.js")).default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        margin: [20, 20, 20, 20], // мм: верх, ліво, низ, право (як в Word)
        filename: `${title}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        // не рвати заголовки, списки й абзаци посеред сторінки
        pagebreak: {
          mode: ["css", "legacy"],
          avoid: ["h1", "h2", "h3", "h4", "li", "p", "pre", "blockquote", "table"],
        },
      };

      await html2pdf().set(options).from(componentRef.current).save();
    } catch (e) {
      console.error("Помилка експорту PDF:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleExport}
        disabled={isExporting}
        variant="outline"
        className="rounded-none border-black/20 hover:bg-gray-50 text-sm"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Експортувати PDF
      </Button>

      {/* Блок для експорту: за межами екрана, але НЕ display:none (інакше буде порожній PDF) */}
      <div style={{ position: "fixed", left: "-10000px", top: 0 }}>
        <div
          ref={componentRef}
          className="prose prose-sm max-w-none font-sans text-black bg-white"
          style={{ width: "170mm", lineHeight: 1.6 }} // 210мм - 2×20мм полів
        >
          <h1 style={{ borderBottom: "1px solid #ddd", paddingBottom: "12px" }}>{title}</h1>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}