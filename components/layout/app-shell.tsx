"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AppSidebar,
  type SidebarUser,
} from "@/components/layout/app-sidebar";

type AppShellProps = {
  user: SidebarUser;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex min-h-svh flex-1 bg-zinc-50">
      <AppSidebar
        user={user}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={openSidebar}
            aria-label="Abrir menu"
            className="text-zinc-600"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold text-zinc-900">Pocky</span>
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
