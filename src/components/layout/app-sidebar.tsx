'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, Library, Brain, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload', href: '/upload', icon: Upload },
  { label: 'Library', href: '/library', icon: Library },
  { label: 'Review', href: '/review', icon: Brain },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background p-4">
      <div className="mb-8 px-2">
        <Link 
          href="/" 
          prefetch={true}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {/* Додаємо картинку логотипу */}
          <img src="/logo.svg" alt="Neorly Logo" className="w-8 h-8" />
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Neorly
          </span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">AI-помічник для навчання</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + '/');
          return (
            <Link
              key={l.href}
              href={l.href}
              prefetch={true}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t">
        <Link 
          href="/" 
          prefetch={true}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4" /> Вийти
        </Link>
      </div>
    </aside>
  );
}