"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function LoadingLink({ href, children, className }: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    router.push(href);
    
    // Якщо через 3 секунди нічого не сталося, скидаємо стан
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={`relative flex items-center justify-center ${className} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </Link>
  );
}