"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  HelpCircle,
  Book,
  Code,
  Building,
  CircleIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const secondaryNavItems = [
  {
    separator: true,
    key: "team-separator",
    ownerOnly: true,
  },
  {
    title: "Team",
    href: "/app/team",
    icon: Building,
    ownerOnly: true,
  },
  {
    separator: true,
    key: "widget-integration-separator",
  },
  {
    title: "Widget Integration",
    href: "/app/widget-integration",
    icon: Code,
    ownerOnly: false,
  },
  {
    title: "Settings",
    href: "/app/settings",
    icon: Settings,
    ownerOnly: true,
  },
  {
    separator: true,
    key: "support-separator",
  },
  {
    title: "Support",
    href: "/app/support",
    icon: HelpCircle,
    ownerOnly: false,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: Book,
    external: true,
    ownerOnly: false,
  },
];

export function NavSecondary() {
  const pathname = usePathname();
  const { data: teamData } = useSWR<{ currentUserRole?: string }>(
    "/api/team",
    fetcher
  );
  const isOwner = teamData?.currentUserRole === "owner";

  // Filter navigation items based on role
  const navItems = secondaryNavItems.filter(
    (item) => !item.ownerOnly || isOwner
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => {
            if (item.separator) {
              if (item.ownerOnly && !isOwner) {
                return null;
              }
              return <SidebarSeparator key={item.key} />;
            }
            const Icon = item.icon ?? CircleIcon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const content = (
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
              >
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <Icon />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link href={item.href ?? "#"}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            );
            return <SidebarMenuItem key={item.href}>{content}</SidebarMenuItem>;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
