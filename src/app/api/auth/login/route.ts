import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = 'LecturizeOnTop';  // This should be a secure, environment-specific secret

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && password === user.password) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id }, // Payload
        JWT_SECRET,
        { expiresIn: '12h' } // Token expiry time, adjust as needed
      );

      // Serialize the cookie
      const cookie = serialize('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/',
        maxAge: 720 * 60 * 60 // 720 hours in seconds (30 days)
      });

      // Set the cookie in the response header
      const response = NextResponse.json({ message: 'Authenticated' });
      response.headers.set('Set-Cookie', cookie);
      return response;
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
