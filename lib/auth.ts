import type { SidebarUser } from "@/components/layout/app-sidebar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

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
    id: user.id,
    name: dbUser?.name ?? user.email ?? "Usuário",
    email: dbUser?.email ?? user.email ?? "",
    avatarUrl: dbUser?.avatarUrl ?? null,
  };
}
