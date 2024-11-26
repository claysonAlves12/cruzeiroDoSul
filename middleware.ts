import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: "lduR2tm4If7E7hflqmWP7UC/E9jxNNk8zpff1FWAFOs=" });

  const { pathname } = req.nextUrl;

  // Permitir acesso a rotas públicas
  if (
    pathname === '/' || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/public') || 
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|map)$/) 
  ) {
    return NextResponse.next();
  }

  // Se não houver token, redirecionar para a página de login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Continuar para rotas protegidas
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/produtos/:path*', // Rota protegida
    '/users/:path*',    // Adicionar outras rotas protegidas aqui, se necessário
  ],
};
