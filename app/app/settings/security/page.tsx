"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Trash2, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { updatePassword, deleteAccount } from "@/app/(auth)/actions";
import { ActionState } from "@/lib/auth/proxy";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SecurityPage() {
  const router = useRouter();
  const { data: teamData } = useSWR<{ currentUserRole?: string }>(
    "/api/team",
    fetcher
  );
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    ActionState,
    FormData
  >(updatePassword, {});

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAccount, {});

  useEffect(() => {
    // Only redirect if we have data AND the role is explicitly not owner
    // Don't redirect if teamData is still loading (currentUserRole is undefined)
    if (
      teamData &&
      teamData.currentUserRole !== undefined &&
      teamData.currentUserRole !== "owner"
    ) {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  // Don't render if not owner (will redirect)
  // But wait for data to load first
  if (
    teamData &&
    teamData.currentUserRole !== undefined &&
    teamData.currentUserRole !== "owner"
  ) {
    return null;
  }

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Security Settings
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>Password</CardTitle>
            <Button
              type="submit"
              form="password-form"
              disabled={isPasswordPending}
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form
            id="password-form"
            className="space-y-4"
            action={passwordAction}
          >
            <div>
              <Label htmlFor="current-password" className="mb-2">
                Current Password
              </Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={passwordState.currentPassword}
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="mb-2">
                New Password
              </Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={passwordState.newPassword}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="mb-2">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={passwordState.confirmPassword}
              />
            </div>
            {passwordState.error && (
              <p className="text-destructive text-sm">{passwordState.error}</p>
            )}
            {passwordState.success && (
              <p className="text-primary text-sm">{passwordState.success}</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Account deletion is non-reversable. Please proceed with caution.
          </p>
          <form action={deleteAction} className="space-y-4">
            <div>
              <Label htmlFor="delete-password" className="mb-2">
                Confirm Password
              </Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={100}
                defaultValue={deleteState.password}
              />
            </div>
            {deleteState.error && (
              <p className="text-destructive text-sm">{deleteState.error}</p>
            )}
            <Button
              type="submit"
              variant="destructive"
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
