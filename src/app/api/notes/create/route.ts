import { PrismaClient, Subject } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { title, content, authorId, classId, subjectId, description } = await req.json();

  if (!title || !content || !authorId || !classId || !subjectId || !description) {
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
        subjectId,
        description
      },
    });

    return NextResponse.json({ newNote }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
