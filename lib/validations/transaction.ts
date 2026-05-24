import { z } from "zod";

const transactionTypeValues = ["income", "expense"] as const;
const paymentMethodValues = [
  "pix",
  "debit_card",
  "credit_card",
  "cash",
  "bank_transfer",
] as const;

export const createTransactionSchema = z.object({
  type: z.enum(transactionTypeValues),
  amount: z.number().positive("Informe um valor maior que zero."),
  category: z.string().min(1, "Selecione uma categoria."),
  paymentMethod: z.enum(paymentMethodValues, {
    error: "Selecione a forma de pagamento.",
  }),
  description: z.string().optional(),
  date: z.coerce.date({ error: "Informe uma data válida." }),
  isFixed: z.boolean(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
