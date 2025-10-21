export const runtime = "nodejs";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin"; // Make sure path is correct

// Function to verify the session cookie using Firebase Admin SDK
async function verifySessionCookie(cookieValue: string | undefined) {
  if (!cookieValue) {
    console.log("Middleware: No session cookie found.");
    return null; // No cookie found
  }

  try {
    // Verify the session cookie. Set checkRevoked to true for added security.
    const decodedToken = await adminAuth.verifySessionCookie(cookieValue, true); //
    console.log(
      "Middleware: Session cookie verified for UID:",
      decodedToken.uid
    );
    return decodedToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Middleware: Error verifying session cookie:",
        error.message
      );
      // Common errors: 'auth/session-cookie-expired', 'auth/session-cookie-revoked', 'auth/invalid-session-cookie'
      return null; // Invalid, expired, or revoked cookie
    }
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("auth__session")?.value; // Get the cookie named 'auth__session'
  const { pathname } = request.nextUrl; // Get the requested path

  console.log(`Middleware running for path: ${pathname}`);

  // 1. Define Public Paths (accessible without login)
  //    Includes the root login page and potentially others like /about, /pricing
  const publicPaths = ["/"]; // Your root page is the login page

  // 2. Define Protected Paths Prefix
  const isProtectedPath = !publicPaths.some((path) => path === pathname);

  // 3. Verify the session cookie
  const decodedToken = await verifySessionCookie(sessionCookie);
  const isAuthenticated = !!decodedToken; // True if decodedToken is not null

  // 4. Handle Redirections
  const loginUrl = new URL("/", request.url); // URL for the login page
  const dashboardUrl = new URL("/overview", request.url); // URL for the main dashboard page

  // If accessing a PROTECTED path
  if (isProtectedPath) {
    if (!isAuthenticated) {
      // User is NOT logged in, redirect to login page
      console.log(
        `Middleware: Unauthenticated access to protected route ${pathname}. Redirecting to login.`
      );
      return NextResponse.redirect(loginUrl);
    }
    // User IS logged in, allow access
    console.log(`Middleware: Authenticated access allowed for ${pathname}.`);
    return NextResponse.next();
  }

  // If accessing a PUBLIC path
  if (publicPaths.includes(pathname)) {
    if (isAuthenticated) {
      // User IS logged in, redirect away from login page to dashboard
      console.log(
        `Middleware: Authenticated user accessing public route ${pathname}. Redirecting to dashboard.`
      );
      return NextResponse.redirect(dashboardUrl);
    }
    // User is NOT logged in, allow access to public page
    console.log(
      `Middleware: Unauthenticated access allowed for public route ${pathname}.`
    );
    return NextResponse.next();
  }

  // Default: Allow access if path doesn't match protected/public rules (e.g., API routes matched by config below)
  return NextResponse.next();
}

// Configure the middleware matcher
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - Include any other public assets (images, svgs, etc.) if needed
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
