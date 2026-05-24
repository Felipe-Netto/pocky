"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TransactionsPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function buildPageHref(searchParams: URLSearchParams, page: number): string {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(page));
  const query = params.toString();
  return query ? `/transacoes?${query}` : "/transacoes";
}

export function TransactionsPagination({
  page,
  pageSize,
  total,
  totalPages,
}: TransactionsPaginationProps) {
  const searchParams = useSearchParams();

  if (total === 0) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        Mostrando {start} a {end} de {total} transações
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-lg border-zinc-200"
          disabled={page <= 1}
          asChild={page > 1}
        >
          {page > 1 ? (
            <Link href={buildPageHref(searchParams, page - 1)} aria-label="Página anterior">
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
            </span>
          )}
        </Button>

        {visiblePages.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant="outline"
            size="icon-sm"
            className={cn(
              "rounded-lg border-zinc-200",
              pageNumber === page &&
                "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50",
            )}
            asChild
          >
            <Link
              href={buildPageHref(searchParams, pageNumber)}
              aria-label={`Página ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-lg border-zinc-200"
          disabled={page >= totalPages}
          asChild={page < totalPages}
        >
          {page < totalPages ? (
            <Link href={buildPageHref(searchParams, page + 1)} aria-label="Próxima página">
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  const maxVisible = 4;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + maxVisible - 1);

  start = Math.max(1, end - maxVisible + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
