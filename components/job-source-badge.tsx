import { Badge } from "@/components/ui/badge";
import { JobSource } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface JobSourceBadgeProps {
  source: JobSource;
  className?: string;
}

/**
 * Reusable component for displaying job source badges.
 * Centralizes the logic for badge variants and labels to ensure
 * consistency across the app and make it easy to add new integrations.
 */
export function JobSourceBadge({ source, className }: JobSourceBadgeProps) {
  const getBadgeVariant = (
    source: JobSource
  ): "default" | "secondary" | "outline" => {
    switch (source) {
      case JobSource.MANUAL:
        return "secondary";
      case JobSource.GREENHOUSE:
        return "outline";
      default:
        return "outline";
    }
  };

  const getSourceLabel = (source: JobSource): string => {
    switch (source) {
      case JobSource.MANUAL:
        return "Manual";
      case JobSource.GREENHOUSE:
        return "Greenhouse";
      default:
        return source;
    }
  };

  const getSourceIcon = (source: JobSource) => {
    switch (source) {
      case JobSource.GREENHOUSE:
        return (
          <Image
            src="/images/icons/GREENHOUSE_ICON_GREEN.svg"
            alt="Greenhouse"
            width={14}
            height={14}
            className="object-contain"
          />
        );
      default:
        return null;
    }
  };

  const icon = getSourceIcon(source);

  return (
    <Badge
      variant={getBadgeVariant(source)}
      className={cn("flex items-center gap-1.5", className)}
    >
      {icon}
      {getSourceLabel(source)}
    </Badge>
  );
}
