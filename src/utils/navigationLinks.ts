import {
  ArrowRight,
  Calendar,
  DollarSign,
  Home,
  PiggyBank,
} from "lucide-react";

const navigationLinks = [
  { id: "overview", name: "Overview", icon: Home },
  { id: "transactions", name: "Transactions", icon: ArrowRight },
  { id: "budgets", name: "Budgets", icon: DollarSign },
  { id: "pots", name: "Pots", icon: PiggyBank },
  { id: "recurring-bills", name: "Recurring Bills", icon: Calendar },
];

export default navigationLinks;
