"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExportButton({ title, content }: { title: string, content: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">${title}</h1>
          <div style="font-size: 14px; line-height: 1.6; color: #333;">${content}</div>
        </div>
      `;
      document.body.appendChild(element);

      const canvas = await html2canvas(element, { scale: 2 });
      document.body.removeChild(element);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`);
      
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