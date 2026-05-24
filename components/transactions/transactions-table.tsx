import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { TransactionRowMenu } from "@/components/transactions/transaction-row-menu";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getCategoryBadgeClassName,
  getCategoryIcon,
  getCategoryLabel,
  getDescriptionIcon,
  getPaymentMethodIcon,
  getPaymentMethodLabel,
  parseTransactionDescription,
} from "@/lib/transaction-display";
import { cn } from "@/lib/utils";
import type { TransactionListItem } from "@/types/transaction";

type TransactionsTableProps = {
  transactions: TransactionListItem[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-900">
          Nenhuma transação encontrada
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Ajuste os filtros ou cadastre uma nova transação.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-100 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            <th className="px-5 py-3 font-medium">Data</th>
            <th className="px-5 py-3 font-medium">Descrição</th>
            <th className="px-5 py-3 font-medium">Categoria</th>
            <th className="px-5 py-3 font-medium">Tipo</th>
            <th className="px-5 py-3 font-medium">Valor</th>
            <th className="px-5 py-3 font-medium">Pagamento</th>
            <th className="px-5 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransactionTableRow({
  transaction,
}: {
  transaction: TransactionListItem;
}) {
  const categoryLabel = getCategoryLabel(transaction.category, transaction.type);
  const { title, subtitle } = parseTransactionDescription(
    transaction.description,
    categoryLabel,
  );
  const DescriptionIcon = getDescriptionIcon(transaction.category);
  const CategoryIcon = getCategoryIcon(transaction.category);
  const PaymentIcon = getPaymentMethodIcon(transaction.paymentMethod);
  const isIncome = transaction.type === "income";

  return (
    <tr className="border-b border-zinc-100 last:border-b-0">
      <td className="px-5 py-4 text-sm text-zinc-600 whitespace-nowrap">
        {formatTransactionDate(transaction.date)}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <DescriptionIcon className="size-4" />
            <span
              className={cn(
                "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white",
                isIncome ? "bg-emerald-500 text-white" : "bg-rose-500 text-white",
              )}
            >
              {isIncome ? (
                <ArrowDownLeft className="size-2.5" />
              ) : (
                <ArrowUpRight className="size-2.5" />
              )}
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">{title}</p>
            {subtitle ? (
              <p className="truncate text-sm text-zinc-500">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            getCategoryBadgeClassName(transaction.category, transaction.type),
          )}
        >
          <CategoryIcon className="size-3.5" />
          {categoryLabel}
        </span>
      </td>

      <td className="px-5 py-4 whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium",
            isIncome ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {isIncome ? (
            <ArrowDownLeft className="size-4" />
          ) : (
            <ArrowUpRight className="size-4" />
          )}
          {isIncome ? "Entrada" : "Saída"}
        </span>
      </td>

      <td
        className={cn(
          "px-5 py-4 text-sm font-medium whitespace-nowrap",
          isIncome ? "text-emerald-600" : "text-rose-600",
        )}
      >
        {formatTransactionAmount(transaction.amount, transaction.type)}
      </td>

      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-2 text-sm text-zinc-600">
          <PaymentIcon className="size-4 text-zinc-400" />
          {getPaymentMethodLabel(transaction.paymentMethod)}
        </span>
      </td>

      <td className="px-5 py-4 text-right">
        <TransactionRowMenu transactionId={transaction.id} />
      </td>
    </tr>
  );
}
