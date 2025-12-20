import Link from "next/link";
import { getUserPublicData, getUser, getTeamForUser } from "@/lib/db/queries";
import { PublicHeader } from "./_components/public-header";
import { CONTACT_SALES_URL } from "@/components/contact-sales-button";

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
                  href="https://cire-studios.moxieapp.com/public/30-minute-support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Suport
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_SALES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Enterprise
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 reqCHECK. All rights reserved.</p>
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
      <PublicHeader
        user={user}
        fullUser={fullUser || null}
        team={team ? { id: team.id, name: team.name } : null}
      />
      {children}
      <PublicFooter />
    </section>
  );
}
