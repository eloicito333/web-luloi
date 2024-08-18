import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import UrlPattern from "url-pattern";

//declare rotue groups to later check if the pathname match them
const adminRoutes = [
  "/admin/*",
  "/api/admin/*"
]

const authRoutes = [
  "/dashboard",
  "/chat",
  "/api/counterWidget/*",
  "/api/notifications/*",
  "/isWidgetNew",
  "/api/chat/*",
]

const publicRoutes = [
  "/api/auth/*",
  "/firebase-messaging-sw.js",
  "/manifest.webmanifest",
  "/icons/*",
  "/images/*",
  "/redirects/*",
]

const adminRoutesPatterns = adminRoutes.map((route) => new UrlPattern(route))
const authRoutesPatterns = authRoutes.map((route) => new UrlPattern(route))
const publicRoutesPatterns = publicRoutes.map((route) => new UrlPattern(route))

//function that checks if the path matches with any of the routes in the route group
const isPathInRouteGroup = (path, routeGroup) => {
  routeGroup = Array.isArray(routeGroup) ? routeGroup : [routeGroup]
  for (const route of routeGroup) {
    if (route.match(path) !== null) return true
  }
  return false
}

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req){
    //console.log(req.nextauth?.token?.role);
    //console.log('req Obj: ', req)

    
    /* return NextResponse.next() */

    //if role == USER --> redirect to /not-autorized
    if (req.nextauth?.token?.role === "USER") {
      let url = new URL("/not-authorized", req.url)
      url.searchParams.append("redirect", req.url)
      return NextResponse.rewrite(url)
    }
    
    //if user isn't logged in --> go to /
    else if (req.nextUrl.pathname === "/" && !req.nextauth?.token) return NextResponse.next()
    else if (!req.nextauth?.token) return NextResponse.redirect(new URL('/', req.url))

    //if logged user goes to / redirect to /dashboard
    else if (req.nextUrl.pathname === "/") return NextResponse.redirect(new URL("/dashboard", req.url))

    //if route is public --> allow
    else if (isPathInRouteGroup(req.nextUrl.pathname, publicRoutesPatterns)) return NextResponse.next()
    
    //if route is for AUTH user --> if user is permited allow (AUTH and ADMIN)
    else if (isPathInRouteGroup(req.nextUrl.pathname, authRoutesPatterns) && (req.nextauth.token.role === "AUTH" || req.nextauth.token.role === "ADMIN")) return NextResponse.next()

    //if route is for ADMIN user --> if user is permited allow (ADMIN)
    else if (isPathInRouteGroup(req.nextUrl.pathname, adminRoutesPatterns) && req.nextauth.token.role === "ADMIN") return NextResponse.next()

    //if not, the user is not authorized to acces the route
    else {
      let url = new URL("/not-authorized", req.url)
      url.searchParams.append("redirect", req.url)
      return NextResponse.rewrite(url)
    }

  },
  {
    callbacks: {
      authorized: (auth) => {
        //console.log('auth Obj: ', auth)
        return true
      },
    },
  }
);

export const config = { matcher: "/((?!api|_next/static|_next/image|favicon.ico|icon.png|icon-white.png|apple-icon.png).*)" };
