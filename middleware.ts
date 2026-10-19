import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isAuthRoute = url.pathname === '/login' || url.pathname === '/register';
  const isProtected = ['/dashboard', '/upload', '/library', '/review', '/progress', '/settings'].some((path) => url.pathname.startsWith(path));

  if (isAuthRoute) {
    return NextResponse.next();
  }
  if (isProtected) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
