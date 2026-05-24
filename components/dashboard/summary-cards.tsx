import { SummaryStatCard } from "@/components/dashboard/summary-stat-card";
import { formatCurrency } from "@/lib/format-currency";
import { getCurrentMonth } from "@/lib/month";
import { getMonthlyFinancialSummary } from "@/services/transactions";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  Wallet,
} from "lucide-react";

type SummaryCardsProps = {
  userId: string;
  month?: string;
};

export async function SummaryCards({ userId, month }: SummaryCardsProps) {
  const summary = await getMonthlyFinancialSummary(
    userId,
    month ?? getCurrentMonth(),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryStatCard
        title="Entradas"
        value={formatCurrency(summary.income)}
        icon={ArrowDownLeft}
        accent="income"
        footer={summary.incomeTrend}
      />
      <SummaryStatCard
        title="Saídas"
        value={formatCurrency(summary.expenses)}
        icon={ArrowUpRight}
        accent="expense"
        footer={summary.expensesTrend}
      />
      <SummaryStatCard
        title="Saldo do mês"
        value={formatCurrency(summary.balance)}
        icon={Scale}
        accent="balance"
        footer={summary.balanceTrend}
      />
      <SummaryStatCard
        title="Disponível para gastar"
        value={`${formatCurrency(summary.availablePerDay)}/dia`}
        icon={Wallet}
        accent="available"
        footer={{
          label: `${formatCurrency(summary.availableMonthly)} no mês`,
        }}
      />
    </div>
  );
}
