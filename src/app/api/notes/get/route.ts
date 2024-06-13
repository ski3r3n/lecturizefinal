import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode("LecturizeOnTop");
const prisma = new PrismaClient();

export async function GET(req: Request) {
  // Get user session
  // Extract the JWT from the "auth" cookie
  const cookieStore = cookies();
  const token = cookieStore.get("auth");

  if (!token) {
    return NextResponse.json(
      { message: "No authentication token found." },
      { status: 401 }
    );
  }

  const { payload } = await jwtVerify(token.value, JWT_SECRET);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: { class: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let notes;
    if (user.role === "TEACHER") {
      notes = await prisma.note.findMany({
        where: { authorId: user.id },
        include: { class: true, author: true },
      });
    } else if (user.role === "STUDENT" && user.classId) {
      notes = await prisma.note.findMany({
        where: { classId: user.classId },
        include: { class: true, author: true },
      });
    } else {
      return new Response(JSON.stringify({ error: "No notes available" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
