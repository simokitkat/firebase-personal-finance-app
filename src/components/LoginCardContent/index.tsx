"use client";

import { createSessionCookie } from "@/app/actions/auth";
import { auth, googleAuthProvider } from "@/lib/firebase/client";
import { Alert, AlertDescription } from "@/lib/shadcn/components/ui/alert";
import { Button } from "@/lib/shadcn/components/ui/button";
import { CardContent } from "@/lib/shadcn/components/ui/card";
import { getIdToken, signInWithPopup } from "firebase/auth";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

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
        <Image
          src="/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className={`${isLoading ? "animate-spin" : ""}`}
        />
        Continue with Google
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
