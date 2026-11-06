"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Shield, LogOut, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsForm({ user }: { user: any }) {
  const [name, setName] = useState(user.user_metadata?.full_name || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleUpdateName = async () => {
    setIsUpdatingName(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });
    if (error) toast.error("Помилка оновлення імені: " + error.message);
    else {
      toast.success("Ім'я успішно оновлено!");
      router.refresh();
    }
    setIsUpdatingName(false);
  };

  const handleResetPassword = async () => {
    setIsResettingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error("Помилка: " + error.message);
    else toast.success("Лист для зміни пароля надіслано!");
    setIsResettingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Ви впевнені? Це назавжди видалить ваші дані.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Не вдалося видалити акаунт");
      await supabase.auth.signOut();
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Профіль */}
      <Card className="bg-white border-black/10 shadow-sm rounded-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">Профіль</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ім'я</label>
              <div className="flex gap-2">
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-none border-black/20 bg-white" 
                />
                <Button 
                  onClick={handleUpdateName} 
                  disabled={isUpdatingName || name === user.user_metadata?.full_name}
                  className="rounded-none bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-xs font-bold"
                >
                  {isUpdatingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Зберегти"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email
              </label>
              <Input 
                defaultValue={user.email} 
                className="h-10 rounded-none border-black/20 bg-gray-50 text-gray-500 cursor-not-allowed" 
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Безпека */}
      <Card className="bg-white border-black/10 shadow-sm rounded-none">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Пароль</p>
              <p className="text-xs text-gray-500">Ми надішлемо вам лист для зміни пароля.</p>
            </div>
          </div>
          <Button 
            onClick={handleResetPassword} 
            disabled={isResettingPassword}
            variant="outline" 
            className="rounded-none border-black/20 hover:bg-gray-50 text-sm"
          >
            {isResettingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Змінити пароль"}
          </Button>
        </CardContent>
      </Card>

      {/* 3. Вихід */}
      <Card className="bg-white border-black/10 shadow-sm rounded-none">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Вихід</p>
              <p className="text-xs text-gray-500">Завершити поточну сесію на цьому пристрої.</p>
            </div>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="rounded-none border-black/20 hover:bg-gray-50 text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" /> Вийти
          </Button>
        </CardContent>
      </Card>

      {/* 4. Видалення (Небезпечна зона) */}
      <Card className="bg-red-50/30 border-red-100 shadow-sm rounded-none">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-red-900">Видалити акаунт</p>
              <p className="text-xs text-red-700/70">Ця дія назавжди видалить ваші дані, пакети та картки.</p>
            </div>
          </div>
          <Button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="rounded-none bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Видалити"}
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}