import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { title, content, authorId, classId } = await req.json();

  if (!title || !content || !authorId || !classId) {
    return NextResponse.json(
      { message: "Missing required fields!" },
      { status: 401 }
    );
  }
  
  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorId,
        classId,
      },
    });

    return NextResponse.json({ newNote }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
