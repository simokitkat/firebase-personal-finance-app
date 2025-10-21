"use client";

import { createSessionCookie } from "@/app/actions/auth";
import { auth, googleAuthProvider } from "@/lib/firebase/client";
import { Alert, AlertDescription } from "@/lib/shadcn/components/ui/alert";
import { Button } from "@/lib/shadcn/components/ui/button";
import { CardContent } from "@/lib/shadcn/components/ui/card";
import { getIdToken, signInWithPopup } from "firebase/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginCardContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;

      if (user) {
        console.log("Firebase Client Sign-In Successful. User:", user.uid); //

        // Get the Firebase ID Token (force refresh recommended for session creation)
        const idToken = await getIdToken(user, /*forceRefresh*/ true); //
        console.log("Obtained ID Token.");

        // 3. Call the Server Action to create the session cookie
        const cookieResult = await createSessionCookie(idToken);
        console.log("Server Action createSessionCookie Result:", cookieResult);

        if (!cookieResult?.success) {
          // If cookie creation fails, show error, maybe sign the user out client-side?
          setError(
            cookieResult?.error || "Failed to create session. Please try again."
          );
          return; // Stop the process here
        }

        // 4. Redirect to the protected area (middleware will handle subsequent checks)
        console.log("Redirecting to /overview...");
        router.replace("/overview");
      } else {
        // Should not happen if signInWithPopup resolves, but good practice
        throw new Error(
          "Authentication failed: No user object found after sign-in."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(
          `Authentication failed: ${err.message || "Please try again."}`
        );
        console.error("Google login error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-6">
      {/* Google Login Button */}
      <Button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 py-6 text-base font-medium transition-all duration-200 hover:shadow-md"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      {/* Status Messages */}
      <div className="mt-4">
        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </CardContent>
  );
};
export default LoginCardContent;
