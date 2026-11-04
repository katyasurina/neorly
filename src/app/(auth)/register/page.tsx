"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    console.log("Спроба реєстрації...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        console.error("Помилка Supabase:", error);
        toast.error(`Помилка: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("Користувача створено в Auth:", data.user.id);
        
        // Створюємо запис у нашій базі даних (Prisma) через API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: data.user.id, email, name }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Помилка створення в БД:", err);
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
      console.error("Критична помилка:", err);
      toast.error("Сталася непередбачена помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Реєстрація в Neorly</h1>
          <p className="text-sm text-zinc-500">Створіть акаунт і почніть вчитись</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ім'я</Label>
            <Input
              id="name"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Зачекайте..." : "Зареєструватися"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Вже маєте акаунт?{" "}
          <Link href="/login" className="font-medium text-black underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}