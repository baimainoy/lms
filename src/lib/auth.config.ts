import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [], // Providers added in auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      const isAuthRoute = ["/login", "/register", "/forgot-password"].some((route) =>
        nextUrl.pathname.startsWith(route)
      );
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isStudentRoute = nextUrl.pathname.startsWith("/student");
      const isPublicRoute = ["/", "/courses", "/about", "/contact"].some(
        (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith("/courses/")
      );

      // Redirect logged-in users away from auth pages
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(
          new URL(userRole === "ADMIN" ? "/admin" : "/student/courses", nextUrl)
        );
      }

      // Allow public routes and auth routes
      if (isPublicRoute || isAuthRoute) {
        return true;
      }

      // Protect admin routes
      if (isAdminRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        if (userRole !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Protect student routes
      if (isStudentRoute) {
        return isLoggedIn || Response.redirect(new URL("/login", nextUrl));
      }

      // Protect cart and checkout
      if (nextUrl.pathname.startsWith("/cart") || nextUrl.pathname.startsWith("/checkout")) {
        return isLoggedIn || Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
