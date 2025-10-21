"use client";
import { clearSessionCookie } from "@/app/actions/auth";
import { auth } from "@/lib/firebase/client";
import { AvatarFallback, AvatarImage } from "@/lib/shadcn/components/ui/avatar";
import { Button } from "@/lib/shadcn/components/ui/button";
import navigationLinks from "@/utils/navigationLinks";
import { Avatar } from "@radix-ui/react-avatar";
import { signOut } from "firebase/auth";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IProps {
  children: React.ReactNode;
}

const SideBar: React.FC<IProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout initiated...");
    try {
      // 1. Call the Server Action to clear the session cookie
      const clearResult = await clearSessionCookie();
      console.log("Server Action clearSessionCookie Result:", clearResult);

      if (!clearResult?.success) {
        // Log the error but proceed with client sign-out anyway
        console.error("Failed to clear session cookie:", clearResult?.error);
      }

      // 2. Sign out the user from the Firebase Client SDK
      await signOut(auth); //
      console.log("Firebase Client Sign-Out Successful.");

      // 3. Redirect to the login page
      console.log("Redirecting to login page...");
      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Logout error (client-side or action call):",
          error.message
        );
      }
    }
  };

  const handleCloseSideBar = () => setSidebarOpen(false);
  const handleOpenSideBar = () => setSidebarOpen(true);

  return (
    <section className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
          onClick={handleCloseSideBar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button (Mobile) */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:hidden">
            <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
            <Button variant="ghost" size="sm" onClick={handleCloseSideBar}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo (Desktop) */}
          <div className="hidden lg:block p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationLinks.map((item) => (
              <Link
                key={item.id}
                onClick={() => {
                  setActiveTab(item.name);
                  handleCloseSideBar();
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.name
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                href={`/${item.id}`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Avatar className="h-10 w-10">
                {auth?.currentUser?.photoURL && (
                  <AvatarImage
                    src={auth?.currentUser?.photoURL}
                    alt="@shadcn"
                  />
                )}

                <AvatarFallback>
                  {auth?.currentUser?.displayName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {auth?.currentUser?.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {auth?.currentUser?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Mobile) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button variant="ghost" size="sm" onClick={handleOpenSideBar}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">FinTrack</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </section>
  );
};
export default SideBar;
