import { SummaryCards } from "@/components/dashboard/summary-cards";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Olá, {user.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Veja quanto você pode gastar com segurança hoje.
        </p>
      </header>

      <section aria-label="Resumo financeiro do mês">
        <SummaryCards />
      </section>
    </div>
  );
}
