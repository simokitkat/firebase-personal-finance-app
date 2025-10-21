// src/app/actions/auth.ts
"use server"; // Mark this file as Server Actions

import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

// Define options for the session cookie
const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
const sessionCookieOptions = {
  name: "auth__session",
  maxAge: expiresIn,
  httpOnly: true, // Crucial: Makes the cookie inaccessible to client-side JavaScript
  secure: process.env.NODE_ENV === "production", // Use secure cookies (HTTPS) in production
  path: "/", // Cookie available across the entire site
  sameSite: "lax" as const, // Recommended for most cases to prevent CSRF
};

export async function createSessionCookie(idToken: string) {
  try {
    // Verify the ID token using the Admin SDK. This also checks if the token is revoked.
    const decodedIdToken = await adminAuth.verifyIdToken(idToken, true);

    // Only generate session cookie if the token is valid (not expired, etc.)
    // verifyIdToken already checks expiration, but an explicit check adds clarity
    if (new Date().getTime() / 1000 < decodedIdToken.exp) {
      // Create the session cookie.
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      // Set the cookie using next/headers
      const appCookies = await cookies();
      appCookies.set(
        sessionCookieOptions.name,
        sessionCookie,
        sessionCookieOptions
      );

      console.log(
        "Session cookie created successfully for UID:",
        decodedIdToken.uid
      );
      return { success: true, message: "Session cookie created." };
    } else {
      // This case might be rare if verifyIdToken is working correctly
      console.warn("Attempted to create session cookie with expired ID token.");
      return { success: false, error: "ID token has expired." };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating session cookie:", error.message);
      return {
        success: false,
        error: "Failed to create session cookie. Invalid token?",
      };
    }
  }
}

export async function clearSessionCookie() {
  try {
    // Clear the cookie by setting its value to empty and maxAge to 0
    const appCookies = await cookies();
    appCookies.set(sessionCookieOptions.name, "", {
      ...sessionCookieOptions,
      maxAge: 0,
    });
    console.log("Session cookie cleared.");
    return { success: true, message: "Session cookie cleared." };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error clearing session cookie:", error.message);
      return { success: false, error: "Failed to clear session cookie." };
    }
  }
}
