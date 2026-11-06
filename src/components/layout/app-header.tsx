'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from '@/lib/supabase/client';

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
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 lg:px-8">
      <h1 className="text-lg font-bold capitalize">{title}</h1>
      
      {/* Випадаюче меню профілю */}
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