import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SyncChallengeQuestions, TeamDataWithMembers } from "@/lib/db/schema";
import { Info } from "lucide-react";
import Link from "next/link";

export default function SyncBehavior({
  teamData,
}: {
  teamData: TeamDataWithMembers;
}) {
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-muted border border-border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg flex items-center gap-2 sm:gap-3 w-full animate-slide-up-expand">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 cursor-default">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm text-foreground">
                Challenge sync:{" "}
                <span className="font-medium">
                  {teamData?.syncChallengeQuestions ===
                  SyncChallengeQuestions.REQCHECK
                    ? "reqCHECK"
                    : "None"}
                </span>
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>
              {teamData?.syncChallengeQuestions ===
              SyncChallengeQuestions.REQCHECK
                ? "All the challenge questions will be cloned when added to your library"
                : "None of the challenge questions will be cloned when added to your library"}
            </p>
          </TooltipContent>
        </Tooltip>
        <Link
          href="/app/settings/configuration#team-settings"
          className="text-xs sm:text-sm text-primary hover:underline font-medium flex-shrink-0"
        >
          Change
        </Link>
      </div>
    </div>
  );
}
