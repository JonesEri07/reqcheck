import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

/**
 * Reusable component for displaying job status badges.
 */
export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const getBadgeVariant = (
    status: JobStatus
  ): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case JobStatus.OPEN:
        return "default";
      case JobStatus.DRAFT:
        return "secondary";
      case JobStatus.ARCHIVED:
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: JobStatus): string => {
    switch (status) {
      case JobStatus.OPEN:
        return "Active";
      case JobStatus.DRAFT:
        return "Draft";
      case JobStatus.ARCHIVED:
        return "Archived";
      default:
        return status;
    }
  };

  return (
    <Badge variant={getBadgeVariant(status)} className={cn(className)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
