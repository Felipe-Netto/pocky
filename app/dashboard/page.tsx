import Image from "next/image";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const displayName = dbUser?.name ?? user.email ?? "Usuário";
  const avatarUrl = dbUser?.avatarUrl ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Pocky
          </span>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Olá, {displayName}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {dbUser?.email ?? user.email}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Gasto disponível
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Em breve você verá aqui quanto pode gastar com segurança.
          </p>
        </section>
      </main>
    </div>
  );
}
