import { SummaryCards } from "@/components/dashboard/summary-cards";
import { NewTransactionDialog } from "@/components/transactions/new-transaction-dialog";
import { TransactionsList } from "@/components/transactions/transactions-list";
import { Button } from "@/components/ui/button";
import { getAuthenticatedUserId } from "@/lib/auth";
import { getCurrentMonth } from "@/lib/month";
import { listTransactions } from "@/services/transactions";
import type { TransactionType } from "@/types/transaction";
import { Download } from "lucide-react";

type TransacoesPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    type?: string;
    month?: string;
  }>;
};

function parsePage(value?: string): number {
  const page = Number(value);

  if (Number.isNaN(page) || page < 1) {
    return 1;
  }

  return page;
}

function parseType(value?: string): TransactionType | undefined {
  if (value === "income" || value === "expense") {
    return value;
  }

  return undefined;
}

export default async function TransacoesPage({
  searchParams,
}: TransacoesPageProps) {
  const params = await searchParams;
  const userId = await getAuthenticatedUserId();
  const defaultMonth = getCurrentMonth();
  const month = params.month ?? defaultMonth;

  const { transactions, total, page, pageSize, totalPages } =
    await listTransactions(userId, {
      page: parsePage(params.page),
      search: params.q,
      category: params.category,
      type: parseType(params.type),
      month,
    });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Transações
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Acompanhe todas as suas transações financeiras.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button
            variant="outline"
            className="w-full border-zinc-200 bg-white p-5 hover:bg-zinc-50 sm:w-auto"
          >
            <Download className="size-4" />
            Exportar
          </Button>
          <NewTransactionDialog />
        </div>
      </header>

      <section aria-label="Resumo financeiro do mês">
        <SummaryCards userId={userId} month={month} />
      </section>

      <section aria-label="Listagem de transações">
        <TransactionsList
          transactions={transactions}
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          defaultMonth={defaultMonth}
        />
      </section>
    </div>
  );
}
