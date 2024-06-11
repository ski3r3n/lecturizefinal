import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const response = NextResponse.json({ message: "Authenticated" }, {status: 200});

    response.headers.set(
      "Set-Cookie",
      serialize("auth", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      })
    );
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
