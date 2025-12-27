import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getNotificationsForTeam } from "@/lib/notifications/queries";
import { Page } from "@/components/page";
import { ContentHeader } from "@/components/content-header";
import { NotificationsList } from "./_components/notifications-list";

export default async function NotificationsPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  const notifications = await getNotificationsForTeam(team.id, {
    includeArchived: false,
  });

  return (
    <Page>
      <ContentHeader title="Notifications" />
      <NotificationsList notifications={notifications} />
    </Page>
  );
}
