import { PrismaClient, Subject } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: "Missing required fields!" },
      { status: 401 }
    );
  }

  try {
    const note = await prisma.note.findUnique({
        where: { id: parseInt(id) },
    });

    if (!note) {
        return NextResponse.json(
          { error: "Note not found." },
          { status: 404 }
        );
    }

    return NextResponse.json({ note }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
