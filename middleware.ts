import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const { pathname } = req.nextUrl;

  
  if (
    pathname === '/' || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/public') || 
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/) 
  ) {
    return NextResponse.next(); 
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/produtos/:path*',
    '/users/:path*',
  ], 
};