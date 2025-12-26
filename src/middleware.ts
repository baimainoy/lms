import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthRoute = ["/login", "/register", "/forgot-password"].some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isStudentRoute = nextUrl.pathname.startsWith("/student");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = ["/", "/courses", "/about", "/contact"].some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith("/courses/")
  );

  // Allow API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/student/courses", nextUrl));
  }

  // Allow public routes
  if (isPublicRoute || isAuthRoute) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect student routes
  if (isStudentRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect cart and checkout
  if (nextUrl.pathname.startsWith("/cart") || nextUrl.pathname.startsWith("/checkout")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
