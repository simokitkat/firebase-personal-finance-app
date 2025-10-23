"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { ArrowDown, ArrowUp, Wallet, Plus, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/shadcn/components/ui/select";
import { Button } from "@/lib/shadcn/components/ui/button";
import { Input } from "@/lib/shadcn/components/ui/input";
import { Label } from "@/lib/shadcn/components/ui/label";

export default function Overview() {
  // Wallet data
  const [wallets, setWallets] = useState([
    { id: 1, name: "Primary Wallet", currency: "USD", balance: 5843.27 },
    { id: 2, name: "Savings Account", currency: "USD", balance: 12500.5 },
    { id: 3, name: "Travel Fund", currency: "EUR", balance: 3200.0 },
  ]);
  const [currentWallet, setCurrentWallet] = useState(wallets[0]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: "",
    currency: "USD",
    balance: 0,
  });

  // Sample data - replace with your actual data
  const [balanceData] = useState({
    current: currentWallet.balance,
    income: 3250.0,
    expenses: 1865.42,
  });

  const [transactions] = useState([
    {
      id: 1,
      type: "expense",
      description: "Grocery Store",
      amount: 87.43,
      currency: "USD",
      date: "2023-11-15",
    },
    {
      id: 2,
      type: "income",
      description: "Salary Deposit",
      amount: 3250.0,
      currency: "USD",
      date: "2023-11-10",
    },
    {
      id: 3,
      type: "expense",
      description: "Electric Bill",
      amount: 125.6,
      currency: "USD",
      date: "2023-11-05",
    },
    {
      id: 4,
      type: "expense",
      description: "Dinner Out",
      amount: 64.32,
      currency: "USD",
      date: "2023-11-03",
    },
  ]);

  // Sample chart data for analysis
  const [chartData] = useState([
    { category: "Food", income: 500, expenses: 300 },
    { category: "Transport", income: 200, expenses: 150 },
    { category: "Entertainment", income: 300, expenses: 250 },
    { category: "Utilities", income: 400, expenses: 350 },
    { category: "Shopping", income: 150, expenses: 400 },
  ]);

  const handleAddWallet = () => {
    if (newWallet.name.trim() === "") return;

    const newWalletObj = {
      id: wallets.length + 1,
      name: newWallet.name,
      currency: newWallet.currency,
      balance: newWallet.balance,
    };

    setWallets([...wallets, newWalletObj]);
    setNewWallet({ name: "", currency: "USD", balance: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Wallet Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Wallets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                value={currentWallet.id.toString()}
                onValueChange={(value) => {
                  const wallet = wallets.find((w) => w.id.toString() === value);
                  if (wallet) setCurrentWallet(wallet);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>{wallet.name}</span>
                        <span className="text-gray-500">
                          ({wallet.currency})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 min-w-[200px]">
              <p className="text-sm text-blue-800">Current Balance</p>
              <p className="text-xl font-semibold text-blue-900">
                {currentWallet.currency}{" "}
                {currentWallet.balance.toLocaleString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Balance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-green-800">
                  Current Balance
                </h3>
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-green-900">
                ${balanceData.current.toLocaleString()}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-blue-800">Income</h3>
                <ArrowDown className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-blue-900">
                +${balanceData.income.toLocaleString()}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-red-800">Expenses</h3>
                <ArrowUp className="h-5 w-5 text-red-600" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-red-900">
                -${balanceData.expenses.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest financial activity
                </CardDescription>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                See More →
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{transaction.description}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} •{" "}
                    {transaction.currency}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column - Analysis */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Financial Analysis</CardTitle>
                <CardDescription>
                  Income vs Expenses by Category
                </CardDescription>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Show More →
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#3b82f6" />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 w-screen h-screen"
          open={isModalOpen}
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Add New Wallet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Wallet Name
                </Label>
                <Input
                  id="name"
                  value={newWallet.name}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, name: e.target.value })
                  }
                  placeholder="e.g., Vacation Fund"
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Currency
                </Label>
                <Select
                  value={newWallet.currency}
                  onValueChange={(value) =>
                    setNewWallet({ ...newWallet, currency: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="balance"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Initial Balance
                </Label>
                <Input
                  id="balance"
                  type="number"
                  value={newWallet.balance}
                  onChange={(e) =>
                    setNewWallet({
                      ...newWallet,
                      balance: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddWallet}
                disabled={!newWallet.name.trim()}
              >
                Add Wallet
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
