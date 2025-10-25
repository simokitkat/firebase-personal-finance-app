import { redirect } from "next/navigation";
import { getUserWallets, createFirstWallet } from "@/app/actions/wallets";
import { getAuthenticatedUser } from "@/utils/auth";
import { WalletSetupForm } from "@/components/WalletSetupForm";

export default async function WalletSetupPage() {
  const user = await getAuthenticatedUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/");
  }

  // Check if user already has wallets
  const walletsResult = await getUserWallets();

  // If user already has wallets, redirect to overview
  if (walletsResult.success && walletsResult.hasWallets) {
    redirect("/overview");
  }

  // Server action for form submission
  async function handleCreateWallet(formData: FormData) {
    "use server";

    const result = await createFirstWallet(formData);

    if (result.success) {
      redirect("/overview");
    } else {
      // We'll handle errors by throwing them to be caught by error.tsx
      // For form-level errors, we can return them
      return result;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fintrack</h1>
          <p className="text-gray-600 mt-2">
            Let&apos;s set up your first wallet
          </p>
        </div>

        {/* Setup Form - Now fully server-side */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Create Your First Wallet
              </h2>
              <p className="text-gray-600 mt-1">
                Set up your main wallet to start tracking your finances
              </p>
            </div>

            <form action={handleCreateWallet} className="space-y-4">
              <WalletSetupForm />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
