"use client";

import { useState } from "react";
import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/shadcn/components/ui/avatar";
import {
  Menu,
  Home,
  ArrowRight,
  DollarSign,
  PiggyBank,
  Calendar,
  LogOut,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { auth } from "@/lib/firebase/config";

export default function ResponsiveSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const navigation = [
    { id: "overview", name: "Overview", icon: Home },
    { id: "transactions", name: "Transactions", icon: ArrowRight },
    { id: "budgets", name: "Budgets", icon: DollarSign },
    { id: "pots", name: "Pots", icon: PiggyBank },
    { id: "recurring", name: "Recurring Bills", icon: Calendar },
  ];

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "JD",
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo (Desktop) */}
          <div className="hidden lg:block p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
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
                  {auth?.currentUser?.displayName}
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
              className="w-full justify-start text-gray-600 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-50"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">FinTrack</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dashboard Content</CardTitle>
                <CardDescription>
                  This is where your dashboard content would go. Currently
                  viewing: {activeTab}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This is a placeholder for the dashboard content. In a real
                  application, this area would display different content based
                  on the selected navigation item.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
