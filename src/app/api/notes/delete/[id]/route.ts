import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = parseInt(params.id);

  if (!noteId) {
    return NextResponse.json({ message: "Invalid note ID!" }, { status: 401 });
  }

  try {
    // Retrieve the note to check if it exists
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
        console.log(noteId)
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId },
    });
    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error deleting note", message: error },
      { status: 500 }
    );
  }
}
