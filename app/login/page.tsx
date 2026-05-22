import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const hasAuthError = error === "auth" || error === "sync";

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pocky
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Entre para planejar seus gastos com segurança.
          </p>
        </div>

        {hasAuthError && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {error === "sync"
              ? "Login concluído, mas não foi possível salvar seu perfil. Tente novamente."
              : "Não foi possível concluir o login. Tente novamente."}
          </p>
        )}

        <GoogleSignInButton />
      </main>
    </div>
  );
}
