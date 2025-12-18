import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleIcon } from "lucide-react";
import { getUserPublicData, getUser, getTeamForUser } from "@/lib/db/queries";
import type { PublicUser } from "@/lib/types/public-user";
import { AuthUser } from "@/components/auth-user";

function PublicHeader({
  user,
  fullUser,
  team,
}: {
  user: PublicUser;
  fullUser?: Awaited<ReturnType<typeof getUser>>;
  team?: Awaited<ReturnType<typeof getTeamForUser>>;
}) {
  return (
    <header className="border-b border-border sticky top-0 bg-background z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 " />
          <span className="ml-2 text-xl font-semibold text-foreground">
            reqCHECK
          </span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          {user ? (
            <AuthUser
              user={fullUser || null}
              team={team ? { id: team.id, name: team.name } : null}
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Link>
              <Button asChild className="rounded-full">
                <Link href="/pricing">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold">reqCHECK</h3>
            <p className="text-muted-foreground text-sm">
              Gate-first skill verification for job applications.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/docs/getting-started"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="/docs/integrations"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/changelog"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="/roadmap"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          {/* <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div> */}
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Suport
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Enterprise
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 reqCHECK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserPublicData();
  // Get full user and team data for AuthUser component
  const fullUser = user ? await getUser() : null;
  const team = user ? await getTeamForUser() : null;

  return (
    <section className="flex flex-col min-h-screen">
      <PublicHeader user={user} fullUser={fullUser} team={team} />
      {children}
      <PublicFooter />
    </section>
  );
}
