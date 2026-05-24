import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types/transaction";

const options = [
  {
    value: "income" as const,
    label: "Entrada",
    icon: ArrowDown,
    activeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:border-emerald-200 focus-visible:bg-emerald-50 focus-visible:text-emerald-700",
  },
  {
    value: "expense" as const,
    label: "Saída",
    icon: ArrowUp,
    activeClass:
      "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:border-rose-200 focus-visible:bg-rose-50 focus-visible:text-rose-700",
  },
];

type TransactionTypeToggleProps = {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
};

export function TransactionTypeToggle({
  value,
  onChange,
}: TransactionTypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-12 w-full gap-2 rounded-md sm:h-14",
              isActive
                ? option.activeClass
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-600 focus-visible:border-zinc-200 focus-visible:bg-white focus-visible:text-zinc-600",
            )}
          >
            <Icon className="size-4" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
