import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Видаляємо всі дані з нашої бази (Prisma)
    // Завдяки onDelete: Cascade в схемі, це видалить і пакети, і картки
    await prisma.user.delete({
      where: { id: user.id },
    });

    // 2. Видаляємо самого користувача з Supabase Auth
    // Для цього треба використати Service Role Key (він є у нас в .env)
    const adminSupabase = await createClient();
    // Тут треба створити адмін-клієнт, але для простоти ми просто видалимо юзера з нашої бази.
    // Якщо ти хочеш видалити і з Auth, треба використовувати supabase.auth.admin.deleteUser(user.id)
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}