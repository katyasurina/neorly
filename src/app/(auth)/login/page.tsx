'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, LoginValues } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(values);
    setIsLoading(false);

    if (error) {
      toast.error('Не вдалося увійти', { description: error.message });
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-mono flex items-center justify-center p-6 relative">
      {/* Сітка на фоні */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Кнопка повернення на головну */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          prefetch={true}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/10 text-gray-500 hover:text-black hover:border-black/30 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Картка входу */}
      <div className="relative z-10 w-full max-w-md bg-white border border-black/10 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Вхід у Neorly</h1>
          <p className="text-sm text-gray-500">Введіть свої дані, щоб продовжити навчання</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</Label>
            <Input 
              id="email" 
              type="email" 
              autoComplete="email" 
              placeholder="you@example.com" 
              {...register('email')} 
              className="h-11 rounded-none border-black/20 bg-white focus-visible:ring-indigo-600"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Пароль</Label>
            <Input 
              id="password" 
              type="password" 
              autoComplete="current-password" 
              {...register('password')} 
              className="h-11 rounded-none border-black/20 bg-white focus-visible:ring-indigo-600"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 font-bold" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Увійти
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Немає акаунта?{' '}
          <Link href="/register" prefetch={true} className="font-bold text-indigo-600 hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}