"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, Tag, Globe, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const allNavItems = [
  {
    href: "/app/settings/configuration",
    icon: Cog,
    label: "Configuration",
    ownerOnly: true,
  },
  {
    href: "/app/settings/styles",
    icon: Palette,
    label: "Styles",
    ownerOnly: true,
  },
  {
    href: "/app/settings/web",
    icon: Globe,
    label: "Web",
    ownerOnly: true,
  },
  {
    href: "/app/settings/tags",
    icon: Tag,
    label: "Tags",
    ownerOnly: false,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: teamData } = useSWR<{ currentUserRole?: string }>(
    "/api/team",
    fetcher
  );
  const isOwner = teamData?.currentUserRole === "owner";

  // Filter navigation items based on role
  const navItems = allNavItems.filter((item) => !item.ownerOnly || isOwner);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      <div className="px-4 pt-4 relative">
        <div className="bg-muted text-muted-foreground inline-flex h-9 items-center justify-start rounded-lg p-[3px] w-full overflow-x-scroll pr-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                  isActive
                    ? "bg-background text-foreground shadow-sm "
                    : "text-foreground  hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
    </div>
  );
}
