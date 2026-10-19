import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isAuthRoute = url.pathname === '/login' || url.pathname === '/register';
  const isProtected = ['/dashboard', '/upload', '/library', '/review', '/progress', '/settings'].some((path) => url.pathname.startsWith(path));

  if (isAuthRoute) {
    const { data } = await (await import('@/lib/supabase/server')).createClient().then((c) => c.auth.getSession());
    if (data.session) {
      return NextResponse.redirect(new URL('/dashboard', url));
    }
    return NextResponse.next();
  }

  if (isProtected) {
    const res = await updateSession(request);
    const { data } = await (await import('@/lib/supabase/server')).createClient().then((c) => c.auth.getSession());
    if (!data.session) {
      return NextResponse.redirect(new URL('/login', url));
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
