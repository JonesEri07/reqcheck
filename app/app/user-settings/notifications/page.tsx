"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Bell } from "lucide-react";
import { updateNotificationPreferences } from "@/app/(auth)/actions";
import { NotificationType } from "@/lib/db/schema";
import { ActionState } from "@/lib/auth/proxy";
import useSWR from "swr";
import { useToastAction } from "@/lib/utils/use-toast-action";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type NotificationPreferences = {
  [key in NotificationType]?: boolean;
};

const notificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.APPLICATION_RECEIVED]: "New Applications",
  [NotificationType.APPLICATION_VERIFIED]: "Application Verifications",
  [NotificationType.JOB_POSTED]: "Job Postings",
  [NotificationType.JOB_UPDATED]: "Job Updates",
  [NotificationType.INTEGRATION_SYNC_COMPLETE]: "Integration Syncs",
  [NotificationType.SYSTEM_ALERT]: "System Alerts",
  [NotificationType.TEAM_INVITATION]: "Team Invitations",
};

const notificationTypeDescriptions: Record<NotificationType, string> = {
  [NotificationType.APPLICATION_RECEIVED]:
    "Get notified when new applications are received",
  [NotificationType.APPLICATION_VERIFIED]:
    "Get notified when applications are verified",
  [NotificationType.JOB_POSTED]: "Get notified when new jobs are posted",
  [NotificationType.JOB_UPDATED]: "Get notified when jobs are updated",
  [NotificationType.INTEGRATION_SYNC_COMPLETE]:
    "Get notified when integration syncs complete",
  [NotificationType.SYSTEM_ALERT]: "Get notified about important system alerts",
  [NotificationType.TEAM_INVITATION]:
    "Get notified when you're invited to join a team",
};

export default function NotificationsPage() {
  const { data: preferences, mutate } = useSWR<NotificationPreferences>(
    "/api/user/notification-preferences",
    fetcher
  );
  const [localPreferences, setLocalPreferences] =
    useState<NotificationPreferences>({});
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateNotificationPreferences,
    {}
  );

  useToastAction(state);

  // Initialize local preferences from API data
  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    } else {
      // Default all to true if no preferences exist
      const defaults: NotificationPreferences = {};
      Object.values(NotificationType).forEach((type) => {
        defaults[type] = true;
      });
      setLocalPreferences(defaults);
    }
  }, [preferences]);

  // Refresh preferences after successful update
  useEffect(() => {
    if (state?.success) {
      mutate();
    }
  }, [state?.success, mutate]);

  const handleToggle = (type: NotificationType, checked: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

  const handleSubmit = (formData: FormData) => {
    // Add all preferences to form data
    // Use flat keys that will be parsed in the server action
    Object.values(NotificationType).forEach((type) => {
      const value = localPreferences[type] ? "true" : "false";
      formData.set(`preference_${type}`, value);
    });
    formAction(formData);
  };

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Notification Settings
      </h1>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you want to receive. You can update
                these settings at any time.
              </CardDescription>
            </div>
            <Button
              type="submit"
              form="notifications-form"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form
            id="notifications-form"
            action={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              {Object.values(NotificationType).map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-0.5 flex-1">
                    <Label
                      htmlFor={type}
                      className="text-base font-medium cursor-pointer"
                    >
                      {notificationTypeLabels[type]}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {notificationTypeDescriptions[type]}
                    </p>
                  </div>
                  <Switch
                    id={type}
                    checked={localPreferences[type] ?? true}
                    onCheckedChange={(checked) => handleToggle(type, checked)}
                    disabled={isPending}
                  />
                </div>
              ))}
            </div>

            {state?.error && (
              <p className="text-destructive text-sm">{state.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
}
