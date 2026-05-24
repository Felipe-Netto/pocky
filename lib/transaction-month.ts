import type { Prisma } from "@/generated/prisma/client";

import { buildMonthRange } from "@/lib/month";

export function buildTransactionMonthFilter(
  month: string,
): Prisma.TransactionWhereInput | null {
  const range = buildMonthRange(month);

  if (!range) {
    return null;
  }

  return {
    OR: [
      {
        type: "expense",
        paymentMethod: "credit_card",
        billingMonth: month,
      },
      {
        type: "income",
        date: range,
      },
      {
        type: "expense",
        paymentMethod: { not: "credit_card" },
        date: range,
      },
      {
        type: "expense",
        paymentMethod: "credit_card",
        billingMonth: null,
        date: range,
      },
    ],
  };
}

export function buildExpenseMonthFilter(
  month: string,
): Prisma.TransactionWhereInput | null {
  const range = buildMonthRange(month);

  if (!range) {
    return null;
  }

  return {
    OR: [
      {
        paymentMethod: "credit_card",
        billingMonth: month,
      },
      {
        paymentMethod: { not: "credit_card" },
        date: range,
      },
      {
        paymentMethod: "credit_card",
        billingMonth: null,
        date: range,
      },
    ],
  };
}
