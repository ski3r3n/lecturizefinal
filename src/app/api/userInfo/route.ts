import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode('LecturizeOnTop');

export async function GET(req: NextRequest) {
    try {
        // Correctly extract the JWT from the "auth" cookie
        const cookieStore = cookies();
        const token = cookieStore.get('auth');

        if (!token) {
          return NextResponse.json({ message: "No authentication token found." }, { status: 401 });
        }

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
                id: userId // Using the number-casted userId
            }
        });

        if (!user) {
            return NextResponse.json(
              { error: "User not found." },
              { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
          { error: "Invalid or expired token." },
          { status: 500 }
        );
    }
}
