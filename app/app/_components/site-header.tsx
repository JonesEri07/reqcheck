"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { GlobalSearch } from "./global-search";
import { NotificationsButton } from "./notifications-button";
import { ModeToggle } from "./mode-toggle";
import { AuthUser } from "@/components/auth-user";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-2">
        <NotificationsButton />
        <ModeToggle />
        <AuthUser />
      </div>
    </header>
  );
}
