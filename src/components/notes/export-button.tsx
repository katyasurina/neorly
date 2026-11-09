"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

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

      const clone = element.cloneNode(true) as HTMLElement;
      
      // Створюємо контейнер з правильними полями (як на аркуші A4)
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "794px"; // Ширина A4 в пікселях при 96 DPI
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "75px"; // Поля ~20мм
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "14px";
      container.style.lineHeight = "1.6";
      container.style.color = "#333";
      
      container.innerHTML = `
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">${title}</h1>
      `;
      container.appendChild(clone);
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { 
        scale: 2, // Висока якість
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 мм
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 мм
      
      // Розраховуємо, скільки пікселів canvasa вміщується на одній сторінці PDF
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Додаємо першу сторінку
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Додаємо наступні сторінки, поки є контент
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeTitle = transliterate(title);
      pdf.save(`${safeTitle}_notes.pdf`);
      
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