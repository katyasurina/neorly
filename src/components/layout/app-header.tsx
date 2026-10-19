'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();
  const title = pathname.replace(/^\//, '').split('/')[0] || 'Dashboard';

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 lg:px-8">
      <h1 className="text-lg font-bold capitalize">{title}</h1>
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
          <User className="size-4" />
          <span className="hidden sm:inline">Профіль</span>
        </Link>
      </div>
    </header>
  );
}
