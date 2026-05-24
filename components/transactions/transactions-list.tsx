import { Suspense } from "react";

import { TransactionsFilters } from "@/components/transactions/transactions-filters";
import { TransactionsPagination } from "@/components/transactions/transactions-pagination";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import type { TransactionListItem } from "@/types/transaction";

type TransactionsListProps = {
  transactions: TransactionListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  defaultMonth: string;
};

export function TransactionsList({
  transactions,
  total,
  page,
  pageSize,
  totalPages,
  defaultMonth,
}: TransactionsListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <Suspense
        fallback={<div className="h-[76px] border-b border-zinc-100 sm:h-[84px]" />}
      >
        <TransactionsFilters defaultMonth={defaultMonth} />
      </Suspense>

      <TransactionsTable transactions={transactions} />

      <Suspense fallback={null}>
        <TransactionsPagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}
