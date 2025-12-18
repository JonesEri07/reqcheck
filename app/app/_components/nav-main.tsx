"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BookOpen,
  Plug,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { checkDuplicateAliases } from "@/app/app/skills/actions";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    href: "/app/jobs",
    icon: Briefcase,
  },
  {
    title: "Applications",
    href: "/app/applications",
    icon: FileText,
  },
  {
    title: "Skills Library",
    href: "/app/skills",
    icon: BookOpen,
  },
  {
    title: "Integrations",
    href: "/app/integrations",
    icon: Plug,
  },
];

export function NavMain() {
  const pathname = usePathname();
  const [hasDuplicateAliases, setHasDuplicateAliases] = useState(false);

  // Check for duplicate aliases (only for Skills Library)
  useEffect(() => {
    const checkDuplicates = async () => {
      const result = await checkDuplicateAliases();
      if ("hasDuplicates" in result) {
        setHasDuplicateAliases(result.hasDuplicates || false);
      }
    };
    checkDuplicates();
    // Re-check periodically or when navigating to skills page
    const interval = setInterval(checkDuplicates, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Create Job">
              <Link href="/app/jobs/create">
                <Plus />
                <span>Create Job</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const isSkillsLibrary = item.href === "/app/skills";
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link href={item.href} className="relative">
                    <Icon />
                    <span>{item.title}</span>
                    {isSkillsLibrary && hasDuplicateAliases && (
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500 ml-auto" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
