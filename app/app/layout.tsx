import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/site-header";
import { SetupFab } from "./_components/setup-fab";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { TierProtectionProvider } from "@/components/tier-protection/tier-protection-context";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prevent unauthorized access
  const user = await getUser();
  const team = await getTeamForUser();

  if (!user || !team) {
    redirect("/pricing");
  }

  return (
    <TierProtectionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
            {children}
          </div>
          <SetupFab team={team} />
        </SidebarInset>
      </SidebarProvider>
    </TierProtectionProvider>
  );
}
