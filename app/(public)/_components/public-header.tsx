"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  BookKey,
  BookOpenCheck,
  Code,
  Plug,
  Rocket,
  Settings,
} from "lucide-react";
import type { PublicUser } from "@/lib/types/public-user";
import { AuthUser } from "@/components/auth-user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import type { User } from "@/lib/db/schema";
import { Separator } from "@/components/ui/separator";

type Team = {
  id: number;
  name: string;
  currentUserRole?: string | null;
};

interface PublicHeaderProps {
  user: PublicUser;
  fullUser?: User | null;
  team?: Team | null;
}

const productSections = [
  {
    title: "How It Works",
    href: "/#how-it-works",
  },
  {
    title: "Skills Library",
    href: "/#skills",
  },
  {
    title: "Industries",
    href: "/#industries",
  },
  {
    title: "Benefits",
    href: "/#benefits",
  },
  {
    title: "Mobile",
    href: "/#mobile",
  },
];

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
  },
  {
    title: "ATS Integrations",
    href: "/docs/integrations",
    icon: Plug,
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: BookKey,
  },
];

export function PublicHeader({ user, fullUser, team }: PublicHeaderProps) {
  const [hoveredDocSection, setHoveredDocSection] = useState<string | null>(
    docSections[0]?.href || null
  );

  return (
    <header className="border-b border-border sticky top-0 bg-background z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <MobileMenu user={user} fullUser={fullUser} team={team} />
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="ml-2 text-xl font-semibold text-foreground">
                reqCHECK
              </span>
            </Link>
            <nav className="hidden md:flex items-center justify-center flex-1">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground data-[state=open]:text-foreground">
                      Product
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="">
                        <div className="space-y-1">
                          {productSections.map((section) => (
                            <NavigationMenuLink key={section.href} asChild>
                              <Link
                                href={section.href}
                                className="whitespace-nowrap block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                              >
                                {section.title}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md transition-colors"
                      >
                        Pricing
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground data-[state=open]:text-foreground">
                      Docs
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="">
                        <div className="flex gap-6">
                          {/* Left: Category List */}
                          <div className="space-y-1">
                            {docSections.map((section) => {
                              const isHovered =
                                hoveredDocSection === section.href;
                              return (
                                <NavigationMenuLink key={section.href} asChild>
                                  <Link
                                    href={section.href}
                                    onMouseEnter={() =>
                                      setHoveredDocSection(section.href)
                                    }
                                    className={`whitespace-nowrap block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                      isHovered
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    }`}
                                  >
                                    {section.title}
                                  </Link>
                                </NavigationMenuLink>
                              );
                            })}
                          </div>

                          {/* Right: Large Icon Display */}
                          <div className="flex items-center justify-center">
                            {(() => {
                              const activeSection = docSections.find(
                                (section) => section.href === hoveredDocSection
                              );
                              if (!activeSection) return null;
                              const ActiveIcon = activeSection.icon;
                              return (
                                <div className="w-40 h-40 rounded-lg bg-primary/10 flex items-center justify-center border border-border">
                                  <ActiveIcon className="h-16 w-16 text-primary" />
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* Right: Auth/Get Started */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <AuthUser user={fullUser || null} team={team || null} />
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Button asChild className="rounded-full">
                  <Link href="/pricing">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const MobileMenu = ({ user, fullUser, team }: PublicHeaderProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[380px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-left">
              <Link
                href="/"
                onClick={() => setIsSheetOpen(false)}
                className="flex items-center"
              >
                <span className="ml-2 text-xl font-semibold text-foreground">
                  reqCHECK
                </span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="space-y-1">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="product" className="border-none">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium text-foreground hover:no-underline">
                    Product
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="space-y-1">
                      {productSections.map((section) => (
                        <Link
                          key={section.href}
                          href={section.href}
                          onClick={() => setIsSheetOpen(false)}
                          className="block rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-4"
                        >
                          {section.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <Link
                  href="/pricing"
                  onClick={() => setIsSheetOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Pricing
                </Link>
                <AccordionItem value="docs" className="border-none">
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium text-foreground hover:no-underline">
                    Documentation
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="space-y-1">
                      {docSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <Link
                            key={section.href}
                            href={section.href}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-4"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{section.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="my-4" />
              {user ? (
                <div className="pt-2">
                  <AuthUser user={fullUser || null} team={team || null} />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setIsSheetOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>

          {/* Footer */}
          <SheetFooter className="px-6 py-4 border-t">
            <p className="text-xs text-muted-foreground w-full text-center">
              © 2025 reqCHECK. All rights reserved.
            </p>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
