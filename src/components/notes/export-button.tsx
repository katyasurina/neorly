"use client";

import html2canvas from 'html2canvas-pro';
if (typeof window !== 'undefined') {
  (window as any).html2canvas = html2canvas;
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const transliterate = (text: string) => {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    ' ': '_', '?': '', '!': '', '.': '', ',': '', ':': '', ';': '', '"': '', "'": '', '(': '', ')': ''
  };
  return text.split('').map(char => map[char] || char).join('');
};

export default function ExportButton({ title, elementId }: { title: string, elementId: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error("Конспект не знайдено");

      // Клонуємо елемент, щоб не змінювати сторінку
      const clone = element.cloneNode(true) as HTMLElement;

      // Створюємо контейнер з правильними стилями
      const container = document.createElement("div");
      container.style.width = "210mm"; // Ширина A4
      container.style.padding = "20mm"; // Поля з усіх боків
      container.style.backgroundColor = "#ffffff";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "12pt";
      container.style.lineHeight = "1.6";
      container.style.color = "#333";
      container.style.boxSizing = "border-box";

      container.innerHTML = `
        <h1 style="font-size: 20pt; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">${title}</h1>
      `;
      container.appendChild(clone);
      document.body.appendChild(container);

      // Динамічно імпортуємо html2pdf.js
      const html2pdf = (await import("html2pdf.js")).default;

    const opt: any = {
        margin: 0,
        filename: `${transliterate(title)}_notes.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
      };

      await html2pdf().set(opt).from(container).save();

      document.body.removeChild(container);
      toast.success("Конспект успішно експортовано!");
    } catch (error) {
      console.error(error);
      toast.error("Помилка експорту. Спробуйте ще раз.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isExporting}
      variant="outline" 
      className="rounded-none border-black/20 hover:bg-gray-50 text-sm"
    >
      {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
      Експортувати PDF
    </Button>
  );
}