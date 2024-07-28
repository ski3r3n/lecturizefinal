import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('LecturizeOnTop'); // Convert secret to Uint8Array

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth');
    const { pathname } = req.nextUrl;

    if (pathname.includes('/api') || pathname.includes('/_next') || pathname === '/login') {
        return NextResponse.next();
    }

    if (token) {
        try {
            // Verify JWT token
            const { payload } = await jwtVerify(token.value, JWT_SECRET);

            if (payload) {
                if (pathname === '/') {
                    return NextResponse.redirect(new URL('/dashboard', req.url));
                }
                return NextResponse.next();
            }
        } catch (error) {
            // Token verification failed
            return NextResponse.redirect(new URL('/login', req.url));
        }
    } else {
        // No token found, redirect to login
        // if (pathname === '/') {
        //     return NextResponse.next();
        // } else {
        return NextResponse.redirect(new URL('/login', req.url));
        // }
    }
}
