"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateWebhook } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import useSWR from "swr";
import type { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WebhookSettings() {
  const { data: teamData, mutate } = useSWR<any>("/api/team", fetcher);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateWebhook,
    {}
  );

  useToastAction(state);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  useEffect(() => {
    if (teamData) {
      setWebhookUrl(teamData.webhookUrl || "");
      setWebhookSecret(teamData.webhookSecret || "");
    }
  }, [teamData]);

  useEffect(() => {
    if (state?.success) {
      mutate();
    }
  }, [state?.success, mutate]);

  if (!teamData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Webhook Settings</CardTitle>
            <CardDescription>
              Configure webhooks to receive real-time notifications about events
            </CardDescription>
          </div>
          <Button type="submit" form="webhook-form" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Webhook Settings"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form id="webhook-form" action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              name="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
            <p className="text-sm text-muted-foreground">
              The URL where webhook events will be sent
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret</Label>
            <Input
              id="webhookSecret"
              name="webhookSecret"
              type="password"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder="Enter webhook secret"
            />
            <p className="text-sm text-muted-foreground">
              Secret used to verify webhook requests (optional)
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
