import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request){
  const { email, password } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && password === user.password) {
      return NextResponse.json({ message: 'Authenticated' }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}