"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createTransactionSchema } from "@/lib/validations/transaction";
import { createTransaction } from "@/services/transactions";

export type CreateTransactionResult =
  | { success: true }
  | { success: false; error: string };

export async function createTransactionAction(
  input: unknown,
): Promise<CreateTransactionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Você precisa estar autenticado." };
  }

  const parsed = createTransactionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  try {
    await createTransaction(user.id, parsed.data);
    revalidatePath("/transacoes");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Não foi possível salvar a transação. Tente novamente.",
    };
  }
}
