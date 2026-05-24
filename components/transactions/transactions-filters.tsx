"use client";

import { Calendar, Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/types/transaction";

const ALL_FILTER_CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES.filter(
    (category) =>
      !INCOME_CATEGORIES.some((income) => income.value === category.value),
  ),
];

type TransactionsFiltersProps = {
  defaultMonth: string;
};

export function TransactionsFilters({ defaultMonth }: TransactionsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    params.delete("page");

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `/transacoes?${query}` : "/transacoes");
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams({ q: search.trim() || null });
  }

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar transações..."
          className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 pl-10"
        />
      </form>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(value) =>
            updateParams({ category: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-zinc-200 bg-white sm:w-[190px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {ALL_FILTER_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("type") ?? "all"}
          onValueChange={(value) =>
            updateParams({ type: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-zinc-200 bg-white sm:w-[160px]">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="income">Entrada</SelectItem>
            <SelectItem value="expense">Saída</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Calendar className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="month"
            value={searchParams.get("month") ?? defaultMonth}
            onChange={(event) =>
              updateParams({ month: event.target.value || null })
            }
            className="h-11 w-full rounded-xl border-zinc-200 bg-white pl-10 sm:w-[170px]"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          className="h-11 rounded-xl border-zinc-200 bg-white"
        >
          <Filter className="size-4" />
          Filtros
        </Button>
      </div>
    </div>
  );
}
