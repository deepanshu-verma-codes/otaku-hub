import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  
  if (!isLoggedIn && (pathname.startsWith('/profile') || pathname.startsWith('/favorites'))) {
    return Response.redirect(new URL('/auth/signin', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
