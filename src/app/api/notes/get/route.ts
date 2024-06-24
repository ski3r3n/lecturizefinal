import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode("LecturizeOnTop");

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth");

  if (!token) {
    return NextResponse.json(
      { message: "No authentication token found." },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token.value, JWT_SECRET);

    // Assert that userId is a number
    const userId = Number(payload.userId);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId, // Use the asserted userId here
      },
      include: { class: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    let notes;
    if (user.role === "TEACHER") {
      notes = await prisma.note.findMany({
        where: { authorId: user.id },
        include: { class: true, author: true, subject: { select: { code: true, name: true, id: true } } },
      });
    } else if (user.role === "STUDENT" && user.classId) {
      notes = await prisma.note.findMany({
        where: { classId: user.classId },
        include: { class: true, author: true, subject: { select: { code: true, name: true, id: true } } },
      });
    } else {
      return NextResponse.json(
        { message: "No notes available." },
        { status: 404 }
      );
    }

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
