import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const ProtectedRoutes = ['/expenses'];
const AuthRoutes = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });

  if (ProtectedRoutes.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const redirectUrl = new URL('/signin', request.nextUrl);
      return NextResponse.redirect(redirectUrl);
    }
  } else if (AuthRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const redirectUrl = new URL('/', request.nextUrl);
      return NextResponse.redirect(redirectUrl);
    }
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('userEmail', token!.email!);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
