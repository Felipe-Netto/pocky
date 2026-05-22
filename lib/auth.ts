import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { SidebarUser } from "@/components/layout/app-sidebar";

export async function getAuthenticatedUser(): Promise<SidebarUser> {
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

  return {
    name: dbUser?.name ?? user.email ?? "Usuário",
    email: dbUser?.email ?? user.email ?? "",
    avatarUrl: dbUser?.avatarUrl ?? null,
  };
}
