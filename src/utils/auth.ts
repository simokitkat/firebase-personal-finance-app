import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth__session")?.value;

    if (!sessionCookie) {
      return null;
    }

    // Verify the session cookie using Firebase Admin
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    return decodedClaims;
  } catch (error) {
    console.error("Error verifying session cookie:", error);

    // Important: Invalidate session on error (e.g., expired, revoked)
    // Clear the cookie by setting maxAge to 0
    try {
      const cookieStore = await cookies();
      cookieStore.set("auth__session", "", { maxAge: 0, path: "/" });
    } catch (clearError) {
      console.error("Failed to clear invalid session cookie:", clearError);
    }

    return null;
  }
}
