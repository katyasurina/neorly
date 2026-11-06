"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

    useEffect(() => {
    const handleReset = async () => {
      // Отримуємо код з URL (він є в посиланні з листа)
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        // Обмінюємо код на сесію
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          toast.error("Помилка: " + error.message);
        } else {
          toast.success("Сесію створено. Введіть новий пароль.");
        }
      }
    };
    handleReset();
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Помилка: " + error.message);
    } else {
      toast.success("Пароль успішно змінено! Увійдіть з новим паролем.");
      router.push("/login");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-mono p-6">
      <div className="bg-white border border-black/10 p-8 max-w-md w-full shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Новий пароль</h1>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Введіть новий пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-none border-black/20 mt-2"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? "Збереження..." : "Змінити пароль"}
          </Button>
        </form>
      </div>
    </div>
  );
}