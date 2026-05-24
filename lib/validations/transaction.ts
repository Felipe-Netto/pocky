import { z } from "zod";

const transactionTypeValues = ["income", "expense"] as const;
const paymentMethodValues = [
  "pix",
  "debit_card",
  "credit_card",
  "cash",
  "bank_transfer",
] as const;

const monthValuePattern = /^\d{4}-\d{2}$/;

export const createTransactionSchema = z
  .object({
    type: z.enum(transactionTypeValues),
    amount: z.number().positive("Informe um valor maior que zero."),
    category: z.string().min(1, "Selecione uma categoria."),
    paymentMethod: z.enum(paymentMethodValues, {
      error: "Selecione a forma de pagamento.",
    }),
    description: z.string().optional(),
    date: z.coerce.date({ error: "Informe uma data válida." }),
    billingMonth: z
      .string()
      .regex(monthValuePattern, "Informe um mês de fatura válido.")
      .optional(),
    isFixed: z.boolean(),
  })
  .superRefine((data, context) => {
    if (
      data.type === "expense" &&
      data.paymentMethod === "credit_card" &&
      !data.billingMonth
    ) {
      context.addIssue({
        code: "custom",
        message: "Selecione o mês da fatura.",
        path: ["billingMonth"],
      });
    }
  });

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
