import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// This middleware applies authentication logic and custom route handling
export default withAuth(async function middleware(req) {
  const token = req.nextauth.token;

  // Redirect logged-in users from /register to /dashboard
  if (token && req.nextUrl.pathname === "/register") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect logged-out users to /login if they try to access any page other than /register
  if (!token && req.nextUrl.pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is authenticated and accessing allowed pages, continue with the request
  return NextResponse.next();
});

export const config = {
  // The matcher should apply middleware to the routes you want to protect or customize
  matcher: [
    "/",
    "/dashboard",
    "/profile",
    "/post",
    "/specificPost",
    "/categories",
    "/",
  ], // Adjust as needed
};
