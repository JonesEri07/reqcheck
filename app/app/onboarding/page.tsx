import { OnboardingForm } from "./_components/onboarding-form";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/app/tier");
  }

  // If already completed, redirect to dashboard
  if (team.onboardingComplete) {
    redirect("/app/dashboard");
  }

  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to reqCHECK!</h1>
        <p className="text-muted-foreground">
          Let's set up your account. This will only take a moment.
        </p>
      </div>
      <OnboardingForm team={team} userEmail={user.email} />
    </div>
  );
}

