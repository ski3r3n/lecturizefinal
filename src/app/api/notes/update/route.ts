// pages/api/notes/[id].js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { title, content, noteId, classId, subjectId, description } = await req.json();

  if (!title || !content || !noteId || !classId || !subjectId || !description) {
    return NextResponse.json(
      { message: "Missing required fields!" },
      { status: 401 }
    );
  }
  if (typeof (subjectId) != "number") {
    return NextResponse.json(
      { message: "Expected subjectId to be a number" },
      { status: 400 }
    );
  }
  try {
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        description,
        content,
        subjectId,
        classId,
      },
    });

    return NextResponse.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
