export type TransactionType = "income" | "expense";

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Alimentação" },
  { value: "transport", label: "Transporte" },
  { value: "health", label: "Saúde" },
  { value: "housing", label: "Moradia" },
  { value: "leisure", label: "Lazer" },
  { value: "education", label: "Educação" },
  { value: "subscriptions", label: "Assinaturas" },
  { value: "other", label: "Outros" },
] as const;

export const INCOME_CATEGORIES = [
  { value: "salary", label: "Salário" },
  { value: "freelance", label: "Freelance" },
  { value: "investments", label: "Investimentos" },
  { value: "other", label: "Outros" },
] as const;

export const PAYMENT_METHODS = [
  { value: "pix", label: "PIX" },
  { value: "debit_card", label: "Cartão de débito" },
  { value: "credit_card", label: "Cartão de crédito" },
  { value: "bank_transfer", label: "Transferência bancária" },
  { value: "cash", label: "Dinheiro" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

export type TransactionListItem = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  description: string | null;
  date: string;
  billingMonth: string | null;
  isFixed: boolean;
};

export const TRANSACTIONS_PAGE_SIZE = 8;

export type MonthlyFinancialSummary = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  availablePerDay: number;
  availableMonthly: number;
  incomeTrend: {
    label: string;
    trend: "positive" | "negative" | "neutral";
  };
  expensesTrend: {
    label: string;
    trend: "positive" | "negative" | "neutral";
  };
  balanceTrend: {
    label: string;
    trend: "positive" | "negative" | "neutral";
  };
};
