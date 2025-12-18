import {
  getUser,
  getTeamForUser,
  getDashboardStats,
  getDashboardChartData,
} from "@/lib/db/queries";
import { getRecentApplicationsForTeam } from "@/lib/applications/queries";
import { SectionCards } from "./_components/section-cards";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import {
  ApplicationsTable,
  type Application,
} from "./_components/applications-table";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";

export default async function DashboardPage() {
  const user = await getUser();
  const team = await getTeamForUser();

  if (!user || !team) {
    return null;
  }

  const userName = user.name || null;

  // Fetch dashboard data
  const [stats, chartData, recentApplications] = await Promise.all([
    getDashboardStats(team.id),
    getDashboardChartData(team.id),
    getRecentApplicationsForTeam(team.id, 10),
  ]);

  // Transform applications data for the table
  const applications: Application[] = recentApplications.map((app) => ({
    id: app.id,
    email: app.email,
    name: null, // TODO: Get name from verificationAttempts or user data if available
    jobTitle: app.jobTitle,
    score: app.score,
    passed: app.passed,
    completedAt: app.completedAt?.toISOString() || null,
  }));

  return (
    <Page>
      <ContentHeader
        title={userName ? `Welcome back, ${userName}` : "Welcome back"}
        subtitle="Here's what's happening with your applications"
      />
      <SectionCards stats={stats} />
      <ChartAreaInteractive data={chartData} />
      <ApplicationsTable data={applications} />
    </Page>
  );
}
