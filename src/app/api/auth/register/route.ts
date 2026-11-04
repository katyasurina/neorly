import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, email, name } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser) {
      return NextResponse.json({ success: true });
    }

    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB USER CREATE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}