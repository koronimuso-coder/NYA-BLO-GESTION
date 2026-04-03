import { NextResponse } from 'next/server';

export function middleware() {
  // Firebase Auth is handled client-side via AuthGuard component
  // Middleware just passes through — no server-side session cookie needed with Firebase SDK
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
