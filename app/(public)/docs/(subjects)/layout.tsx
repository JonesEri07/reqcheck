"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookKey,
  BookOpenCheck,
  Code,
  Plug,
  Rocket,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const docSections = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: Rocket,
  },
  {
    title: "Installation",
    href: "/docs/installation",
    icon: Settings,
  },
  {
    title: "Widget Integration",
    href: "/docs/widget-integration",
    icon: Code,
  },
  {
    title: "Skills & Challenges",
    href: "/docs/skills-challenges",
    icon: BookOpenCheck,
    children: [
      {
        title: "Multiple Choice",
        href: "/docs/skills-challenges/multiple-choice",
      },
      {
        title: "Fill in the Blank",
        href: "/docs/skills-challenges/fill-in-the-blank",
      },
    ],
  },
  {
    title: "ATS Integrations",
    href: "/docs/integrations",
    icon: Plug,
    children: [
      {
        title: "Greenhouse",
        href: "/docs/integrations/greenhouse",
      },
      {
        title: "Lever",
        href: "/docs/integrations/lever",
      },
      {
        title: "Ashby",
        href: "/docs/integrations/ashby",
      },
    ],
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: BookKey,
  },
];

export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Sidebar - Hidden on mobile, shown on desktop */}
      <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/40">
        <div className="sticky top-14 self-start max-h-[calc(100vh-6rem)] overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {docSections.map((section) => {
              const isActive = pathname === section.href;
              const hasActiveChild =
                section.children?.some((child) => pathname === child.href) ||
                false;
              const isOnChildRoute = section.children?.some((child) =>
                pathname.startsWith(child.href)
              );
              const showChildren =
                section.children &&
                (isActive || hasActiveChild || isOnChildRoute);

              return (
                <div key={section.href}>
                  <Link
                    href={section.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive || hasActiveChild || isOnChildRoute
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <section.icon className="size-4 shrink-0" />
                    <span>{section.title}</span>
                  </Link>
                  {showChildren && section.children && (
                    <div className="ml-7 mt-1 space-y-1">
                      {section.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              isChildActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
