import { redirect } from "next/navigation";
import { getCurrentUserTeamMember } from "@/lib/db/queries";

export default async function SettingsPage() {
  const teamMember = await getCurrentUserTeamMember();

  // Redirect non-owners to dashboard
  if (!teamMember || teamMember.role !== "owner") {
    redirect("/app/dashboard");
  }

  redirect("/app/settings/configuration");
}
