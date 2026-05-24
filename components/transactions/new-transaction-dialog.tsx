"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NewTransactionForm } from "@/components/transactions/new-transaction-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewTransactionDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full p-5 bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-600/50 sm:w-auto">
          <Plus className="size-4" />
          Nova transação
        </Button>
      </DialogTrigger>

      <DialogContent
        className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-xl border-zinc-200 p-0 shadow-2xl top-4 translate-y-0 sm:top-1/2 sm:max-w-[560px] sm:-translate-y-1/2"
      >
        <DialogHeader className="shrink-0 space-y-0 px-4 pt-4 pb-4 sm:px-6 sm:pt-6">
          <DialogTitle className="pr-8 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Nova transação
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6">
          {open ? <NewTransactionForm onSuccess={handleSuccess} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
