import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (!id) {
    return NextResponse.json(
      { message: "Missing required fields!" },
      { status: 401 }
    );
  }

  try {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { class: true, author: true, subject: { select: { code: true, name: true, id: true } } },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }
    return NextResponse.json({ note }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
