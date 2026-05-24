"use client";

import { Calendar, CreditCard, Receipt, Wallet } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";

import { createTransactionAction } from "@/actions/transactions";
import { TransactionTypeToggle } from "@/components/transactions/transaction-type-toggle";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatMonthLabel, getCurrentMonth, getNextMonth } from "@/lib/month";
import { parseCurrencyInput } from "@/lib/parse-currency-input";
import { cn } from "@/lib/utils";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  type PaymentMethod,
  type TransactionType,
} from "@/types/transaction";

const inputClassName = "h-12 rounded-md";

type NewTransactionFormProps = {
  onSuccess?: () => void;
};

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildDescription(description: string, notes: string): string | undefined {
  const trimmedDescription = description.trim();
  const trimmedNotes = notes.trim();

  if (trimmedDescription && trimmedNotes) {
    return `${trimmedDescription}\n\n${trimmedNotes}`;
  }

  if (trimmedDescription) {
    return trimmedDescription;
  }

  if (trimmedNotes) {
    return trimmedNotes;
  }

  return undefined;
}

export function NewTransactionForm({ onSuccess }: NewTransactionFormProps) {
  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayDateInputValue);
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [billingMonth, setBillingMonth] = useState(getCurrentMonth);
  const [description, setDescription] = useState("");
  const [isFixed, setIsFixed] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const showBillingMonthField =
    type === "expense" && paymentMethod === "credit_card";
  const currentMonth = getCurrentMonth();
  const nextMonth = getNextMonth();

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory("");
    setBillingMonth(getCurrentMonth());
  }

  function handlePaymentMethodChange(value: PaymentMethod) {
    setPaymentMethod(value);

    if (type === "expense" && value === "credit_card") {
      setBillingMonth(getCurrentMonth());
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedAmount = parseCurrencyInput(amount);

    if (parsedAmount === null) {
      setError("Informe um valor válido.");
      return;
    }

    startTransition(async () => {
      const result = await createTransactionAction({
        type,
        amount: parsedAmount,
        category,
        paymentMethod,
        description: buildDescription(description, notes),
        date,
        billingMonth: showBillingMonthField ? billingMonth : undefined,
        isFixed,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      onSuccess?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <TransactionTypeToggle value={type} onChange={handleTypeChange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Valor">
          <div className="flex h-12 items-center overflow-hidden rounded-xl border border-zinc-200">
            <span className="flex h-full items-center border-r border-zinc-200 px-4 text-sm text-zinc-500">
              R$
            </span>
            <Input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
              inputMode="decimal"
              required
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </FormField>

        <FormField label="Data">
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className={cn(inputClassName, "pl-10")}
            />
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Categoria">
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className={inputClassName}>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Pagamento">
          <Select
            value={paymentMethod}
            onValueChange={(value) =>
              handlePaymentMethodChange(value as PaymentMethod)
            }
            required
          >
            <SelectTrigger className={inputClassName}>
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-zinc-400" />
                <SelectValue placeholder="Selecione a forma" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {showBillingMonthField ? (
        <FormField label="Mês da fatura">
          <Select value={billingMonth} onValueChange={setBillingMonth} required>
            <SelectTrigger className={inputClassName}>
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-zinc-400" />
                <SelectValue placeholder="Selecione o mês da fatura" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={currentMonth}>
                Este mês ({formatMonthLabel(currentMonth)})
              </SelectItem>
              <SelectItem value={nextMonth}>
                Próximo mês ({formatMonthLabel(nextMonth)})
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-zinc-500">
            Define em qual mês essa despesa será contabilizada no seu orçamento.
          </p>
        </FormField>
      ) : null}

      <FormField label="Descrição">
        <Input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Mercado, aluguel, salário..."
          className={inputClassName}
        />
      </FormField>

      <div className="rounded-2xl border border-zinc-200 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-zinc-500" />
              <p className="text-sm font-medium text-zinc-900">
                Transação recorrente
              </p>
            </div>
            <p className="text-sm text-zinc-500">
              Essa movimentação acontece todos os meses.
            </p>
          </div>
          <Switch checked={isFixed} onCheckedChange={setIsFixed} />
        </div>
      </div>

      <FormField label="Observações">
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Adicione uma observação..."
          className="min-h-[110px] resize-none rounded-2xl"
        />
      </FormField>

      {error ? (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-11 w-full px-5 sm:w-auto"
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full px-6 sm:w-auto bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-600/50"
        >
          {isPending ? "Salvando..." : "Salvar transação"}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
