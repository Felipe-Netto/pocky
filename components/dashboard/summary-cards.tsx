import { SummaryStatCard } from "@/components/dashboard/summary-stat-card";
import { formatCurrency } from "@/lib/format-currency";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  Wallet,
} from "lucide-react";

// Placeholder até transações estarem implementadas
const SUMMARY_DATA = {
  income: 4000,
  expenses: 1850,
  balance: 2150,
  availablePerDay: 72,
  availableMonthly: 2150,
  incomeTrend: "+12% vs mês anterior",
  expensesTrend: "+8% vs mês anterior",
  balanceTrend: "+21% vs mês anterior",
} as const;

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryStatCard
        title="Entradas"
        value={formatCurrency(SUMMARY_DATA.income)}
        icon={ArrowDownLeft}
        accent="income"
        footer={{ label: SUMMARY_DATA.incomeTrend, trend: "positive" }}
      />
      <SummaryStatCard
        title="Saídas"
        value={formatCurrency(SUMMARY_DATA.expenses)}
        icon={ArrowUpRight}
        accent="expense"
        footer={{ label: SUMMARY_DATA.expensesTrend, trend: "negative" }}
      />
      <SummaryStatCard
        title="Saldo do mês"
        value={formatCurrency(SUMMARY_DATA.balance)}
        icon={Scale}
        accent="balance"
        footer={{ label: SUMMARY_DATA.balanceTrend, trend: "neutral" }}
      />
      <SummaryStatCard
        title="Disponível para gastar"
        value={`${formatCurrency(SUMMARY_DATA.availablePerDay)}/dia`}
        icon={Wallet}
        accent="available"
        footer={{
          label: `${formatCurrency(SUMMARY_DATA.availableMonthly)} no mês`,
        }}
      />
    </div>
  );
}
