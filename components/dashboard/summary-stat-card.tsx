import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

const trendConfig = {
  positive: { Icon: TrendingUp, className: "text-emerald-600" },
  negative: { Icon: TrendingDown, className: "text-rose-600" },
  neutral: { Icon: Minus, className: "text-zinc-400" },
} as const;

type TrendType = keyof typeof trendConfig;

function FooterTrendIcon({ trend }: { trend: TrendType }) {
  const { Icon, className } = trendConfig[trend];
  return <Icon className={cn("size-3.5 shrink-0", className)} aria-hidden />;
}

type SummaryStatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  accent: "income" | "expense" | "balance" | "available";
  footer?: {
    label: string;
    trend?: "positive" | "neutral" | "negative";
  };
};

const valueStyles = {
  income: "text-emerald-600",
  expense: "text-rose-600",
  balance: "text-violet-600",
  available: "text-emerald-600",
};

const iconStyles = {
  income: "bg-emerald-100 text-emerald-600",
  expense: "bg-rose-100 text-rose-600",
  balance: "bg-violet-100 text-violet-600",
  available: "bg-emerald-100 text-emerald-600",
};

export function SummaryStatCard({
  title,
  value,
  icon: Icon,
  accent,
  footer,
}: SummaryStatCardProps) {
  return (
    <Card className="h-full gap-0 py-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-semibold text-zinc-900">{title}</p>
          <p
            className={cn(
              "text-2xl font-bold tracking-tight tabular-nums",
              valueStyles[accent],
            )}
          >
            {value}
          </p>
          {footer && (
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              {footer.trend && <FooterTrendIcon trend={footer.trend} />}
              <span>{footer.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full",
            iconStyles[accent],
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
    </Card>
  );
}
