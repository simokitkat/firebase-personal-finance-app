import { Button } from "@/lib/shadcn/components/ui/button";
import { Input } from "@/lib/shadcn/components/ui/input";
import { Label } from "@/lib/shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/shadcn/components/ui/select";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
];

export function WalletSetupForm() {
  return (
    <>
      {/* Wallet Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Wallet Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Main Wallet, Savings, etc."
          defaultValue="Main Wallet"
          required
          className="h-11"
        />
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select name="currency" defaultValue="USD" required>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} - {currency.name} ({currency.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Initial Balance */}
      <div className="space-y-2">
        <Label htmlFor="initialBalance">Initial Balance</Label>
        <Input
          id="initialBalance"
          name="initialBalance"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue="0"
          className="h-11"
        />
        <p className="text-sm text-muted-foreground">
          You can start with zero or enter your current balance
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full h-11">
        Create Wallet & Continue
      </Button>
    </>
  );
}
