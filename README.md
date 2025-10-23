# Personal Finance App

## 🎯 A High-Level Overview

### **User Flow:**

1. **Registration** → Google Auth → Wallet Creation
2. **Main Navigation** between 3 core pages
3. **Wallet-centric** data with smart filtering

## 🏗️ Updated Database Structure

### **Collections:**

**`wallets`**

```typescript
{
  id: string;
  userId: string;
  name: string; // "Main Wallet", "Savings", etc.
  currency: string; // "USD", "EUR", "GBP"
  initialBalance: number;
  currentBalance: number; // Calculated field
  createdAt: Date;
  isActive: boolean;
}
```

**`transactions`**

```typescript
{
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}
```

**`categories`** (pre-defined per user)

```typescript
{
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}
```

## 🔄 Complete User Journey

### **Phase 1: Registration & Wallet Setup**

**User Story 1.1: First-Time Wallet Creation**

```
As a new user
I want to create my first wallet with currency and initial balance
So that I can start tracking my finances immediately
```

**Flow:**

1. User completes Google Auth
2. Redirected to wallet creation page (`/wallets/create`)
3. **Form Fields**:
   - Wallet Name: "Main Wallet" (default, editable)
   - Currency: Dropdown with 20+ currencies (USD, EUR, GBP, etc.)
   - Initial Balance: Number input (default: 0)
4. **Validation**:
   - Wallet name required
   - Currency required
   - Initial balance can be negative (for debt situations)
5. On submit → Creates wallet → Redirects to Overview page

### **Phase 2: Core Navigation**

## 📊 Page 1: Overview (`/overview`)

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│ [Wallet Picker] Main Wallet ($) | Savings (€)          │
├────────────────────────────────────────────────────────┤
│ Balance: $2,500       Income: $3,000    Expenses: $500 │
├────────────────────────────────────────────────────────┤
│ Recent Transactions          │ Expenses by Category    │
│ • Groceries      -$50       │ ████ Food       40%      │
│ • Salary         +$3,000    │ ███ Rent        30%      │
│ • Rent           -$1,500    │ ██ Transport    20%      │
│ • Freelance      +$500      │ █ Entertainment 10%      │
│ • Coffee         -$5        │                          │
│ [View All Transactions]      │ [View Full Analysis]    │
└────────────────────────────────────────────────────────┘
```

**User Story 2.1: View Wallet Overview**

```
As a user
I want to see key financial metrics and recent activity for a selected wallet
So that I can quickly understand my financial status
```

**Components:**

- **Wallet Picker**: Dropdown to switch between wallets
- **Key Metrics Card**: Balance, Income, Expenses (for selected period)
- **Recent Transactions**: Last 5-7 transactions
- **Category Breakdown**: Pie chart of expense categories

## 📋 Page 2: Transactions (`/transactions`)

**Layout:**

```
┌────────────────────────────────────────────────────────────────┐
│ Transactions                                   [Add New]       │
├────────────────────────────────────────────────────────────────┤
│ Filters: [All Wallets ▽] [Date Range ▽] [Category ▽] [Search] │
├────────────────────────────────────────────────────────────────┤
│ Date       | Wallet    | Category | Description   | Amount     │
│ 2024-01-15 | Main      | Salary   | January Salary| +$3,000    │
│ 2024-01-14 | Savings   | Transfer | To savings    | -$500      │
│ 2024-01-13 | Main      | Food     | Groceries     | -$85       │
│ 2024-01-12 | Main      | Freelance| Project X     | +$500      │
│ 2024-01-11 | Main      | Rent     | January rent  | -$1,500    │
├────────────────────────────────────────────────────────────────┤
│ Showing 1-10 of 45 transactions [1] [2] [3] [4] [5]            │
└────────────────────────────────────────────────────────────────┘
```

**User Story 2.2: Manage All Transactions**

```
As a user
I want to view, filter, and search all my transactions across wallets
So that I can track my complete financial activity
```

**Features:**

- **Multi-wallet Filter**: Checkboxes for wallet selection
- **Pagination**: 10-25 transactions per page
- **Sorting**: Click column headers to sort
- **Search**: Real-time search in description
- **Bulk Actions**: Select multiple → Delete/Edit category

## 📈 Page 3: Analysis (`/analysis`)

**Layout:**

```
┌─────────────────────────────────────────────────┐
│ Analysis                         [Wallet Picker]│
├─────────────────────────────────────────────────┤
│ Income vs Expenses (Last 30 days)               │
│ ┌─────────────────────────────────────────────┐ │
│ │ ████ Income                                 │ │
│ │ ██████████ Expenses                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Spending by Category (Current Month)            │
│ ┌─────────────────────────────────────────────┐ │
│ │ ████ Food (35%)                             │ │
│ │ █████████ Rent (25%)                        │ │
│ │ ███ Transport (15%)                         │ │
│ │ ██ Entertainment (10%)                      │ │
│ │ ██ Utilities (8%)                           │ │
│ │ █ Other (7%)                                │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**User Story 2.3: Analyze Financial Patterns**

```
As a user
I want to visualize my income vs expenses and spending by category
So that I can identify trends and make better financial decisions
```

**Charts:**

1. **Income vs Expenses Over Time**: Bar/line chart (last 30 days, monthly, etc.)
2. **Spending by Category**: Pie chart or horizontal bar chart

## 🎛️ Smart Wallet Filtering Logic

### **Overview & Analysis Pages:**

```typescript
// Single wallet selection
const [selectedWallet, setSelectedWallet] = useState<string>("all");

// Data fetching depends on selected wallet
const { data: overviewData } = useOverviewData(selectedWallet);
const { data: analysisData } = useAnalysisData(selectedWallet);
```

### **Transactions Page:**

```typescript
// Multi-wallet selection
const [selectedWallets, setSelectedWallets] = useState<string[]>(["all"]);

// "All" means all wallets, or specific wallet IDs
const { data: transactions } = useTransactions({
  wallets: selectedWallets,
  page: currentPage,
  sortBy: sortField,
});
```

## 🔧 API Routes Structure

### **Overview API** (`/api/overview?walletId=`)

```typescript
GET /api/overview?walletId=wallet123
Response:
{
  balance: 2500,
  income: 3000,
  expenses: 500,
  recentTransactions: Transaction[],
  categoryBreakdown: { category: string; amount: number; percentage: number }[]
}
```

### **Transactions API** (`/api/transactions`)

```typescript
GET /api/transactions?wallets[]=wallet1&wallets[]=wallet2&page=1&limit=10&sortBy=date&sortOrder=desc
Response:
{
  transactions: Transaction[],
  totalCount: 45,
  totalPages: 5,
  currentPage: 1
}
```

### **Analysis API** (`/api/analysis?walletId=`)

```typescript
GET /api/analysis?walletId=wallet123&period=month
Response:
{
  incomeVsExpenses: { date: string; income: number; expenses: number }[],
  spendingByCategory: { category: string; amount: number; percentage: number }[]
}
```

## 🚀 Implementation Priority

### **Phase 1: MVP (Week 1)**

1. Wallet creation after registration
2. Basic transaction CRUD
3. Overview page with hard-coded charts
4. Transactions list with basic filtering

### **Phase 2: Enhanced (Week 2)**

1. Real charts on Overview & Analysis
2. Advanced transaction filtering
3. Multi-wallet support in Transactions
4. Pagination and sorting

### **Phase 3: Polish (Week 3)**

1. Responsive design
2. Loading states and error handling
3. Performance optimizations
4. Additional wallet management

## 💡 Benefits of This Approach

1. **Clear User Journey**: No confusion about where to go next
2. **Progressive Complexity**: Start simple, add features as needed
3. **Mobile-Friendly**: 3-tab navigation works great on mobile
4. **Scalable**: Easy to add features like budgets, goals later
5. **Maintainable**: Clean separation of concerns

## 🎯 Recommended Tech Stack

- **UI**: Shadcn/UI or Tailwind components
- **Charts**: Recharts or Chart.js
- **State**: React Context or Zustand
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table for advanced features

This simplified approach gives you a production-ready app structure that's much faster to build and easier for users to understand. The wallet-centric model is intuitive and matches how people actually think about their money!
