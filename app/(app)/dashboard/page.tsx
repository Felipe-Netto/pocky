import { getAuthenticatedUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Olá, {user.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Veja quanto você pode gastar com segurança hoje.
        </p>
      </header>

      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 sm:p-8">
        <h2 className="text-sm font-medium text-zinc-900">Gasto disponível</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Em breve você verá aqui quanto pode gastar sem comprometer suas metas.
        </p>
      </section>
    </div>
  );
}
