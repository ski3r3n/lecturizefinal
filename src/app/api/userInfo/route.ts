import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode('LecturizeOnTop');
const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Extract the JWT from the "auth" cookie
        const cookieStore = cookies()
        const token = cookieStore.get('auth')
        
        
        if (!token) {
          return NextResponse.json({ message: "No authentication token found." }, { status: 401 });
        }

        const { payload } = await jwtVerify(token.value, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: payload.userId // Assuming your payload contains the userId
            }
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found." }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
          { error: "Invalid or expired token." },
          { status: 500 }
        );
    }
    
  }