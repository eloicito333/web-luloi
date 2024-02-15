import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req){
    console.log(req)
    console.log(req.nextauth?.token?.role);
    

    if (req.nextauth?.token?.role === "USER") {
      let url = new URL("/no-authorized", req.url)
      url.searchParams.append("redirect", req.url)
      return NextResponse.redirect(url)
    }
    else if (req.nextUrl.pathname === "/" && !req.nextauth?.token) return NextResponse.next()
    else if (req.nextUrl.pathname.startsWith('/api/notifications') && req.nextauth?.token?.role !== "ADMIN" && req.nextauth?.token?.role !== "AUTH") return NextResponse.status(403)
    else if (!req.nextauth?.token) return NextResponse.redirect(new URL('/', req.url))
    else if (req.nextUrl.pathname === "/") return NextResponse.redirect(new URL("/dashboard", req.url))
    else if (req.nextauth.token.role === "ADMIN") {
      return NextResponse.next()
    } else if (req.nextauth.token.role === "AUTH" && (
      req.nextUrl.pathname.startsWith("/dashboard")
    )) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL("/", req.url))
    }

  },
  {
    callbacks: {
      authorized: (auth) => {
        console.log(auth?.token)
        return true
      },
    },
  }
);

export const config = { matcher: ["/", "/admin/:path*", "/dashboard", "/api/notifications/[...path]"] };