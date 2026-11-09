'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Settings, LogOut, LayoutDashboard, Menu, LayoutGrid, Upload, Library, Brain } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload', href: '/upload', icon: Upload },
  { label: 'Library', href: '/library', icon: Library },
  { label: 'Review', href: '/review', icon: Brain },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const title = pathname.replace(/^\//, '').split('/')[0] || 'Dashboard';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-8">
      
      {/* Ліва частина: Бургер (мобільний) + Заголовок */}
      <div className="flex items-center gap-4">
        {/* Бургер-меню для мобільних */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <div className="mb-8 px-2">
                <Link href="/" className="text-xl font-extrabold tracking-tight text-foreground">
                  Neorly
                </Link>
                <p className="text-xs text-muted-foreground">AI-помічник для навчання</p>
              </div>
              <nav className="flex flex-col space-y-1">
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
            </SheetContent>
          </Sheet>
        </div>

        <h1 className="text-lg font-bold capitalize">{title}</h1>
      </div>
      
      {/* Права частина: Профіль */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors outline-none">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline text-sm font-medium">Профіль</span>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56 rounded-none border-black/10 shadow-md">
          <DropdownMenuLabel className="font-mono">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Мій акаунт</span>
              <span className="text-xs text-gray-500 font-normal">Керування профілем</span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-black/5" />
          
          <DropdownMenuItem asChild className="cursor-pointer font-mono text-sm rounded-none hover:bg-gray-50">
            <Link href="/profile" className="flex items-center gap-2 w-full">
              <User className="w-4 h-4 text-gray-500" />
              Мій профіль
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer font-mono text-sm rounded-none hover:bg-gray-50">
            <Link href="/dashboard" className="flex items-center gap-2 w-full">
              <LayoutDashboard className="w-4 h-4 text-gray-500" />
              Дашборд
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="cursor-pointer font-mono text-sm rounded-none hover:bg-gray-50">
            <Link href="/settings" className="flex items-center gap-2 w-full">
              <Settings className="w-4 h-4 text-gray-500" />
              Налаштування
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-black/5" />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer font-mono text-sm rounded-none text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
    </header>
  );
}