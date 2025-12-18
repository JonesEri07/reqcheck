import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { BillingPlan } from "@/lib/db/schema";
import { SetupChecklist } from "./_components/setup-checklist";
import { WhatsNewSection } from "./_components/whats-new-section";
import { ResourcesSection } from "./_components/resources-section";

export default async function AppPage() {
  const user = await getUser();
  const team = await getTeamForUser();

  if (!user || !team) {
    return null;
  }

  const userName = user.name || user.email.split("@")[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Let's get you started with verifying your job applicants.
        </p>
      </div>

      {/* Setup Checklist - Only shown if quickSetupDidComplete is true */}
      {team.quickSetupDidComplete && (
        <div className="mb-8">
          <SetupChecklist
            companyId={team.id}
            billingPlan={team.billingPlan as BillingPlan}
          />
        </div>
      )}

      {/* What's New Section */}
      <div className="mb-8">
        <WhatsNewSection />
      </div>

      {/* Resources Section */}
      {/* <div className="mb-8">
        <ResourcesSection />
      </div> */}

      {/* Call-to-Action Button */}
      <div className="flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href="/app/dashboard">
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
