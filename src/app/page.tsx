import Auth from "@/components/Auth";
import LoginCardContent from "@/components/LoginCardContent";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";

export default function GoogleLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and App Name */}
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">FinTrack</h1>
          <p className="text-gray-600 mt-2">Your personal finance companion</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <LoginCardContent />
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
