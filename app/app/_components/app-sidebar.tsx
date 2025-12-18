"use client";

import Link from "next/link";
import { CircleIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/app"
          className="flex items-center gap-2 px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <CircleIcon className="h-6 w-6" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
            reqCHECK
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
        {/* <NavUser /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
