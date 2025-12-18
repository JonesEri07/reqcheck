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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateWhitelistUrls } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import useSWR from "swr";
import type { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WhitelistSettings() {
  const { data: teamData, mutate } = useSWR<any>("/api/team", fetcher);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateWhitelistUrls,
    {}
  );

  useToastAction(state);

  const [urls, setUrls] = useState("");

  useEffect(() => {
    if (teamData?.whitelistUrls) {
      setUrls(teamData.whitelistUrls.join("\n"));
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
    <Card id="whitelist-urls">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Whitelist URLs</CardTitle>
            <CardDescription>
              Add URLs where the widget is allowed to be embedded. One URL per
              line. Must be valid HTTP/HTTPS URLs.
            </CardDescription>
          </div>
          <Button type="submit" form="whitelist-form" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Whitelist"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form id="whitelist-form" action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="urls">Allowed URLs</Label>
            <Textarea
              id="urls"
              name="urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com&#10;https://app.example.com/jobs"
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Enter one URL per line. Example: https://example.com
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
