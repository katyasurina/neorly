"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        toast.error(`Помилка: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Створюємо запис у нашій базі даних (Prisma) через API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: data.user.id, email, name }),
        });

        if (!res.ok) {
          toast.error("Помилка створення профілю в базі");
          setLoading(false);
          return;
        }

        toast.success("Реєстрація успішна!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Перевірте пошту для підтвердження!");
      }
    } catch (err: any) {
      toast.error("Сталася непередбачена помилка");
    } finally {
      setLoading(false);
    }
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

      {/* Картка реєстрації */}
      <div className="relative z-10 w-full max-w-md bg-white border border-black/10 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Реєстрація в Neorly</h1>
          <p className="text-sm text-gray-500">Створіть акаунт і почніть вчитись</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ім'я</Label>
            <Input
              id="name"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-none border-black/20 bg-white focus-visible:ring-indigo-600"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-none border-black/20 bg-white focus-visible:ring-indigo-600"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 rounded-none border-black/20 bg-white focus-visible:ring-indigo-600"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 font-bold" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Вже маєте акаунт?{" "}
          <Link href="/login" prefetch={true} className="font-bold text-indigo-600 hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}