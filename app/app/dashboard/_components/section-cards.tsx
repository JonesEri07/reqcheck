import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Shield } from "lucide-react";
import type { DashboardStats } from "@/lib/db/queries";

interface SectionCardsProps {
  stats: DashboardStats;
}

export function SectionCards({ stats }: SectionCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 5xl:grid-cols-4 mb-8">
      {/* Total Applications Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applications
          </CardTitle>
          <Badge
            variant={stats.applicationChange >= 0 ? "default" : "secondary"}
            className="gap-1"
          >
            {stats.applicationChange >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {formatPercentage(stats.applicationChange)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.totalApplications)}
          </div>
          <CardDescription className="mt-1">
            Applications this month
          </CardDescription>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            {stats.applicationChange >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {stats.applicationChange >= 0 ? "Up" : "Down"} from last month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pass Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          <Badge
            variant={stats.passRateChange >= 0 ? "default" : "secondary"}
            className="gap-1"
          >
            {stats.passRateChange >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {formatPercentage(stats.passRateChange)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.passRate.toFixed(1)}%
          </div>
          <CardDescription className="mt-1">
            Average pass rate this month
          </CardDescription>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            {stats.passRateChange >= 0 ? (
              <>
                <TrendingUp className="h-3 w-3" />
                <span>Improving quality</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3" />
                <span>Needs attention</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Jobs Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <Badge variant="default" className="gap-1">
            <Activity className="h-3 w-3" />
            Active
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.activeJobs)}
          </div>
          <CardDescription className="mt-1">
            Currently active job postings
          </CardDescription>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Currently active</span>
          </div>
        </CardContent>
      </Card>

      {/* Prevented Applicants Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Prevented Applicants
          </CardTitle>
          <Badge
            variant={
              stats.preventedApplicantsChange >= 0 ? "default" : "secondary"
            }
            className="gap-1"
          >
            {stats.preventedApplicantsChange >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {formatPercentage(stats.preventedApplicantsChange)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.preventedApplicants)}
          </div>
          <CardDescription className="mt-1">
            Spam/unfit applicants prevented this month
          </CardDescription>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>
              {stats.preventedApplicantsChange >= 0
                ? "More filtered"
                : "Fewer filtered"}{" "}
              than last month
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
