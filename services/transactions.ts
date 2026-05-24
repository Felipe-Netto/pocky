import type { Prisma } from "@/generated/prisma/client";

import { buildPercentTrend } from "@/lib/financial-summary";
import {
  buildMonthRange,
  getCurrentMonth,
  getDaysInMonth,
  getPreviousMonth,
} from "@/lib/month";
import { prisma } from "@/lib/prisma";
import type { CreateTransactionInput } from "@/lib/validations/transaction";
import {
  TRANSACTIONS_PAGE_SIZE,
  type MonthlyFinancialSummary,
  type TransactionListItem,
  type TransactionType,
} from "@/types/transaction";

type ListTransactionsOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  type?: TransactionType;
  month?: string;
};

function serializeTransaction(
  transaction: Prisma.TransactionGetPayload<object>,
): TransactionListItem {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount),
    category: transaction.category,
    paymentMethod: transaction.paymentMethod,
    description: transaction.description,
    date: transaction.date.toISOString(),
    isFixed: transaction.isFixed,
  };
}

async function sumByTypeForMonth(
  userId: string,
  month: string,
  type: TransactionType,
): Promise<number> {
  const range = buildMonthRange(month);

  if (!range) {
    return 0;
  }

  const result = await prisma.transaction.aggregate({
    where: {
      userId,
      type,
      date: range,
    },
    _sum: {
      amount: true,
    },
  });

  return Number(result._sum.amount ?? 0);
}

export async function getMonthlyFinancialSummary(
  userId: string,
  month: string = getCurrentMonth(),
): Promise<MonthlyFinancialSummary> {
  const previousMonth = getPreviousMonth(month);

  const [income, expenses, previousIncome, previousExpenses] = await Promise.all([
    sumByTypeForMonth(userId, month, "income"),
    sumByTypeForMonth(userId, month, "expense"),
    sumByTypeForMonth(userId, previousMonth, "income"),
    sumByTypeForMonth(userId, previousMonth, "expense"),
  ]);

  const balance = income - expenses;
  const previousBalance = previousIncome - previousExpenses;
  const daysInMonth = getDaysInMonth(month);
  const availablePerDay = daysInMonth > 0 ? balance / daysInMonth : 0;

  return {
    month,
    income,
    expenses,
    balance,
    availablePerDay,
    availableMonthly: balance,
    incomeTrend: buildPercentTrend(income, previousIncome, "higher-is-better"),
    expensesTrend: buildPercentTrend(
      expenses,
      previousExpenses,
      "lower-is-better",
    ),
    balanceTrend: buildPercentTrend(balance, previousBalance, "higher-is-better"),
  };
}

export async function listTransactions(
  userId: string,
  options: ListTransactionsOptions = {},
) {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? TRANSACTIONS_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where: Prisma.TransactionWhereInput = { userId };

  if (options.type) {
    where.type = options.type;
  }

  if (options.category) {
    where.category = options.category;
  }

  if (options.search?.trim()) {
    const search = options.search.trim();
    where.OR = [
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  if (options.month) {
    const range = buildMonthRange(options.month);

    if (range) {
      where.date = range;
    }
  }

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions: rows.map(serializeTransaction),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
) {
  return prisma.transaction.create({
    data: {
      userId,
      type: input.type,
      amount: input.amount,
      category: input.category,
      paymentMethod: input.paymentMethod,
      description: input.description ?? null,
      date: input.date,
      isFixed: input.isFixed,
    },
  });
}
