"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export default function ExportButton({ title, content }: { title: string, content: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
    contentRef: componentRef, // <--- ОСЬ ТУТ ЗМІНА
    documentTitle: title,
    onBeforePrint: async () => {
      setIsExporting(true);
    },
    onAfterPrint: async () => {
      setIsExporting(false);
    },
  });
  return (
    <>
      <Button 
        onClick={handlePrint} 
        disabled={isExporting}
        variant="outline" 
        className="rounded-none border-black/20 hover:bg-gray-50 text-sm"
      >
        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
        Експортувати PDF
      </Button>

      {/* Прихований блок, який буде експортуватися */}
      <div className="hidden">
        <div 
          ref={componentRef} 
          className="p-10 max-w-[800px] font-sans text-black bg-white"
          style={{ lineHeight: 1.6 }}
        >
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">{title}</h1>
          {/* Тут ми рендеримо HTML, який вже згенерований з Markdown */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </>
  );
}