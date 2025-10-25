export const runtime = "nodejs";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin"; // Make sure path is correct

// --- Helper Function to Check Wallet Existence ---
async function checkUserHasWallets(userId: string): Promise<boolean> {
  try {
    const walletsQuery = adminDb
      .collection("wallets")
      .where("userId", "==", userId)
      .where("isActive", "==", true)
      .limit(1); // We only need to know if at least one exists

    const walletsSnapshot = await walletsQuery.get();
    console.log(
      `Middleware: Wallet check for ${userId}. Found: ${!walletsSnapshot.empty}`
    );
    return !walletsSnapshot.empty;
  } catch (error) {
    console.error(
      `Middleware: Error checking wallets for user ${userId}:`,
      error
    );
    // Fail safe: If DB check fails, maybe let them proceed? Or redirect to an error page?
    // Let's assume for now they might have wallets if the check fails.
    return true; // Or handle error appropriately
  }
}

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
  const firstWalletPath = "/first-wallet";
  const isPublicPath = publicPaths.includes(pathname);
  const isFirstWalletPath = pathname === firstWalletPath;

  // 2. Verify the session cookie
  const decodedToken = await verifySessionCookie(sessionCookie);
  const isAuthenticated = !!decodedToken; // True if decodedToken is not null

  // 3. Handle Redirections
  const loginUrl = new URL("/", request.url); // URL for the login page
  const overviewUrl = new URL("/overview", request.url); // URL for the main dashboard page
  const firstWalletUrl = new URL(firstWalletPath, request.url);

  // --- Logic ---

  if (isAuthenticated) {
    // --- Authenticated User Logic ---
    const userId = decodedToken.uid;
    const hasWallets = await checkUserHasWallets(userId);

    if (isPublicPath) {
      // Authenticated user on login page -> redirect to overview or first-wallet
      console.log(
        `Middleware: Authenticated user on public path ${pathname}. Redirecting.`
      );
      return NextResponse.redirect(hasWallets ? overviewUrl : firstWalletUrl);
    }

    if (!hasWallets && !isFirstWalletPath) {
      // Authenticated user *without* wallets trying to access something other than setup page -> redirect to setup
      console.log(
        `Middleware: Authenticated user ${userId} has no wallets. Redirecting to ${firstWalletPath}.`
      );
      return NextResponse.redirect(firstWalletUrl);
    }

    if (hasWallets && isFirstWalletPath) {
      // Authenticated user *with* wallets trying to access setup page -> redirect to overview
      console.log(
        `Middleware: Authenticated user ${userId} already has wallets. Redirecting from ${firstWalletPath} to overview.`
      );
      return NextResponse.redirect(overviewUrl);
    }

    // Authenticated user with wallets accessing protected pages (or without wallets accessing setup page) -> Allow
    console.log(
      `Middleware: Authenticated access allowed for ${pathname}. Has Wallets: ${hasWallets}`
    );
    return NextResponse.next();
  } else {
    // --- Unauthenticated User Logic ---
    if (!isPublicPath) {
      // Unauthenticated user trying to access protected path -> redirect to login
      console.log(
        `Middleware: Unauthenticated access to protected route ${pathname}. Redirecting to login.`
      );
      return NextResponse.redirect(loginUrl);
    }

    // Unauthenticated user on public path -> Allow
    console.log(
      `Middleware: Unauthenticated access allowed for public route ${pathname}.`
    );
    return NextResponse.next();
  }
}

// Configure the middleware matcher (keep your existing one)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
