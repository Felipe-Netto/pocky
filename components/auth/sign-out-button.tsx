"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  layout?: "default" | "sidebar";
  icon?: ReactNode;
};

export function SignOutButton({
  layout = "default",
  icon,
}: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleSignOut}
      disabled={isLoading}
      className={
        layout === "sidebar" ? "h-10 w-full gap-2 px-4" : "h-10 px-4"
      }
    >
      {icon}
      {isLoading ? "Saindo..." : "Sair"}
    </Button>
  );
}
