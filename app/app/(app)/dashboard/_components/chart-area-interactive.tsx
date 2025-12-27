"use client";

import * as React from "react";
import { Area, CartesianGrid, XAxis, Line, ComposedChart } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

type ChartDataPoint = {
  date: string;
  passed: number;
  failed: number;
  total?: number;
};

type ChartAreaInteractiveProps = {
  data: ChartDataPoint[];
};

const chartConfig = {
  applications: {
    label: "Applications",
  },
  passed: {
    label: "Passed",
    color: "var(--chart-2)",
  },
  failed: {
    label: "Failed",
    color: "var(--destructive)",
  },
  total: {
    label: "Total",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    startDate.setHours(0, 0, 0, 0);

    return data
      .filter((item) => {
        const date = new Date(item.date);
        return date >= startDate;
      })
      .map((item) => ({
        ...item,
        total: item.passed + item.failed,
      }));
  }, [data, timeRange]);

  const timeRangeLabel = React.useMemo(() => {
    if (timeRange === "90d") {
      return "Last 3 months";
    } else if (timeRange === "30d") {
      return "Last 30 days";
    } else if (timeRange === "7d") {
      return "Last 7 days";
    }
    return "Last 3 months";
  }, [timeRange]);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Application Volume</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Total applications for the last {timeRangeLabel}
            </span>
            <span className="@[540px]/card:hidden">{timeRangeLabel}</span>
          </CardDescription>
          <CardAction>
            <div className="hidden @[767px]/card:flex h-9 w-[280px] animate-pulse rounded-md bg-muted" />
            <div className="flex h-8 w-40 animate-pulse rounded-md bg-muted @[767px]/card:hidden" />
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="aspect-auto h-[250px] w-full animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Application Volume</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total applications for the last {timeRangeLabel}
          </span>
          <span className="@[540px]/card:hidden">{timeRangeLabel}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          id="dashboard-chart"
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="fillPassed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-passed)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-passed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="failed"
              type="monotone"
              fill="url(#fillFailed)"
              stroke="var(--color-failed)"
              stackId="a"
            />
            <Area
              dataKey="passed"
              type="monotone"
              fill="url(#fillPassed)"
              stroke="var(--color-passed)"
              stackId="a"
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
