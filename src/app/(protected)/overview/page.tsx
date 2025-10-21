"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { Progress } from "@/lib/shadcn/components/ui/progress";
import { ArrowDown, ArrowUp, Clock, Wallet } from "lucide-react";

export default function Overview() {
  // Sample data - replace with your actual data
  const [balanceData] = useState({
    current: 5843.27,
    income: 3250.0,
    expenses: 1865.42,
  });

  const [savingsPots] = useState([
    { name: "Emergency Fund", amount: 3200.0 },
    { name: "Vacation", amount: 850.5 },
    { name: "Car Maintenance", amount: 450.0 },
    { name: "Gifts", amount: 342.77 },
  ]);

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

  const [budgets] = useState([
    { category: "Entertainment", limit: 200, spent: 143.25 },
    { category: "Groceries", limit: 400, spent: 287.5 },
    { category: "Utilities", limit: 300, spent: 275.0 },
    { category: "Dining Out", limit: 150, spent: 112.75 },
  ]);

  const [recurringBills] = useState([
    { name: "Netflix", amount: 15.99, status: "paid", dueDate: "2023-11-20" },
    { name: "Spotify", amount: 9.99, status: "paid", dueDate: "2023-11-22" },
    {
      name: "Gym Membership",
      amount: 45.0,
      status: "upcoming",
      dueDate: "2023-12-01",
    },
    {
      name: "Phone Bill",
      amount: 65.0,
      status: "due soon",
      dueDate: "2023-11-25",
    },
  ]);

  const totalSaved = savingsPots.reduce((sum, pot) => sum + pot.amount, 0);
  const totalBudgetLimit = budgets.reduce(
    (sum, budget) => sum + budget.limit,
    0
  );
  const totalBudgetSpent = budgets.reduce(
    (sum, budget) => sum + budget.spent,
    0
  );
  const totalPaidBills = recurringBills
    .filter((bill) => bill.status === "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const totalUpcomingBills = recurringBills
    .filter((bill) => bill.status === "upcoming")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const totalDueSoonBills = recurringBills
    .filter((bill) => bill.status === "due soon")
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
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
        {/* Left Column */}
        <div className="space-y-6">
          {/* Savings Pots */}
          <Card>
            <CardHeader>
              <CardTitle>Savings Pots</CardTitle>
              <CardDescription>
                Total Saved: ${totalSaved.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savingsPots.map((pot) => (
                <div
                  key={pot.name}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{pot.name}</h3>
                  </div>
                  <p className="font-semibold">
                    ${pot.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Budgets */}
          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
              <CardDescription>
                ${totalBudgetSpent.toLocaleString()} spent of $
                {totalBudgetLimit.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((budget) => {
                const percentage = Math.min(
                  100,
                  (budget.spent / budget.limit) * 100
                );
                return (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{budget.category}</h3>
                      <p className="text-sm">
                        ${budget.spent.toLocaleString()} of $
                        {budget.limit.toLocaleString()}
                      </p>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        percentage > 90
                          ? "bg-red-500"
                          : percentage > 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recurring Bills */}
          <Card>
            <CardHeader>
              <CardTitle>Recurring Bills</CardTitle>
              <CardDescription>
                <div className="flex justify-between">
                  <span>Paid: ${totalPaidBills.toLocaleString()}</span>
                  <span>Upcoming: ${totalUpcomingBills.toLocaleString()}</span>
                  <span>Due Soon: ${totalDueSoonBills.toLocaleString()}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recurringBills.map((bill) => (
                <div
                  key={bill.name}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        bill.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : bill.status === "upcoming"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{bill.name}</h3>
                      <p className="text-sm text-gray-500">
                        Due {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${bill.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
