import {
  Briefcase,
  Car,
  CreditCard,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  type LucideIcon,
  MoreHorizontal,
  Receipt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrendingUp,
  Tv,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

import { formatCurrency } from "@/lib/format-currency";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  type PaymentMethod,
  type TransactionType,
} from "@/types/transaction";

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryLabel(
  category: string,
  type: TransactionType,
): string {
  const categories =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const match = categories.find((item) => item.value === category);

  if (match) {
    return match.label;
  }

  const fallback = ALL_CATEGORIES.find((item) => item.value === category);
  return fallback?.label ?? category;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return (
    PAYMENT_METHODS.find((item) => item.value === method)?.label ?? method
  );
}

export function formatTransactionDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function formatTransactionAmount(
  amount: number,
  type: TransactionType,
): string {
  const formatted = formatCurrency(amount);

  if (type === "expense") {
    return `- ${formatted}`;
  }

  return formatted;
}

export function parseTransactionDescription(
  description: string | null,
  categoryLabel: string,
): { title: string; subtitle: string } {
  if (!description?.trim()) {
    return { title: categoryLabel, subtitle: "" };
  }

  const [firstLine, ...rest] = description.trim().split("\n");
  const title = firstLine.trim() || categoryLabel;
  const subtitle = rest.join("\n").trim();

  return { title, subtitle };
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  salary: Briefcase,
  freelance: Receipt,
  investments: TrendingUp,
  food: ShoppingCart,
  transport: Car,
  health: Heart,
  housing: Home,
  leisure: Sparkles,
  education: GraduationCap,
  subscriptions: Tv,
  other: MoreHorizontal,
};

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category] ?? Wallet;
}

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  pix: Smartphone,
  debit_card: CreditCard,
  credit_card: CreditCard,
  cash: Wallet,
  bank_transfer: Landmark,
};

export function getPaymentMethodIcon(method: PaymentMethod): LucideIcon {
  return PAYMENT_METHOD_ICONS[method];
}

export function getCategoryBadgeClassName(
  category: string,
  type: TransactionType,
): string {
  if (type === "income") {
    return "bg-emerald-50 text-emerald-700";
  }

  const styles: Record<string, string> = {
    food: "bg-rose-50 text-rose-700",
    transport: "bg-violet-50 text-violet-700",
    leisure: "bg-purple-50 text-purple-700",
    health: "bg-sky-50 text-sky-700",
    housing: "bg-amber-50 text-amber-800",
    education: "bg-indigo-50 text-indigo-700",
    subscriptions: "bg-fuchsia-50 text-fuchsia-700",
  };

  return styles[category] ?? "bg-zinc-100 text-zinc-700";
}

export function getDescriptionIcon(category: string): LucideIcon {
  if (category === "food") {
    return UtensilsCrossed;
  }

  return getCategoryIcon(category);
}
