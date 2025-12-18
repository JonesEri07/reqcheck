"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  currentLimit: number;
  upgradeLimit?: number;
  featureName?: string;
  showUpgrade?: boolean;
  planName?: string;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  title,
  description,
  currentLimit,
  upgradeLimit,
  featureName = "this feature",
  showUpgrade = true,
  planName,
}: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-sm font-medium">
                {showUpgrade ? "Current Plan Limit" : "Plan Limit"}
              </span>
              <span className="text-sm font-semibold">{currentLimit}</span>
            </div>
            {showUpgrade && upgradeLimit && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">Pro Plan Limit</span>
                <span className="text-sm font-semibold text-primary">
                  {upgradeLimit}
                </span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {showUpgrade ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button asChild>
                <Link href="/app/settings/subscription">
                  Upgrade to Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
