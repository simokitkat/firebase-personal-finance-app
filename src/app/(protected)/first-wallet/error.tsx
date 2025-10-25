"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/lib/shadcn/components/ui/button";
import { Alert, AlertDescription } from "@/lib/shadcn/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fintrack</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message ||
                "Something went wrong while setting up your wallet"}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/overview")}
            >
              Go to Overview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
