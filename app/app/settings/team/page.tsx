"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { customerPortalAction } from "@/lib/payments/actions";
import { useActionState } from "react";
import {
  TeamDataWithMembers,
  User,
  SubscriptionStatus,
  BillingPlan,
  PlanName,
} from "@/lib/db/schema";
import {
  removeTeamMember,
  inviteTeamMember,
  updateTeamName,
} from "@/app/(auth)/actions";
import useSWR from "swr";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Edit2, Check, X } from "lucide-react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { ActionState } from "@/lib/auth/proxy";
import { InvitationsTable } from "./_components/invitations-table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function TeamInfoSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-32 bg-muted rounded"></div>
          <div className="h-3 w-24 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamInfo() {
  const { data: teamData, mutate } = useSWR<
    TeamDataWithMembers & { currentUserRole?: string }
  >("/api/team", fetcher);
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [updateState, updateAction, isUpdatePending] = useActionState<
    ActionState,
    FormData
  >(updateTeamName, {});

  useToastAction(updateState);

  const isOwner = teamData?.currentUserRole === "owner";

  // Initialize team name when data loads
  useEffect(() => {
    if (teamData && !isEditing) {
      setTeamName(teamData.name);
    }
  }, [teamData, isEditing]);

  // Handle successful update
  useEffect(() => {
    if (updateState?.success && isEditing) {
      setIsEditing(false);
      mutate(); // Refresh team data
    }
  }, [updateState?.success, isEditing, mutate]);

  if (!teamData) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-muted-foreground">Team Name</p>
              {isOwner && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-6 px-2"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            {isEditing && isOwner ? (
              <form
                action={(formData) => {
                  formData.set("teamName", teamName);
                  updateAction(formData);
                }}
                className="flex items-center gap-2"
              >
                <Input
                  name="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="flex-1"
                  required
                  minLength={1}
                  maxLength={100}
                  disabled={isUpdatePending}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdatePending || !teamName.trim()}
                >
                  {isUpdatePending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setTeamName(teamData.name);
                  }}
                  disabled={isUpdatePending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <p className="font-medium text-foreground">{teamData.name}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created</p>
            <p className="text-foreground">
              {new Date(teamData.createdAt).toLocaleDateString()}
            </p>
          </div>
          {teamData.teamMembers && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Members
              </p>
              <p className="text-foreground">
                {teamData.teamMembers.length} member
                {teamData.teamMembers.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-32 bg-muted rounded"></div>
          <div className="h-3 w-24 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                Current Plan: {teamData?.planName || PlanName.FREE}
              </p>
              <p className="text-sm text-muted-foreground">
                {(() => {
                  if (
                    teamData?.subscriptionStatus === SubscriptionStatus.ACTIVE
                  ) {
                    return teamData?.billingPlan === BillingPlan.ANNUAL
                      ? "Billed annually"
                      : "Billed monthly";
                  }
                  if (
                    teamData?.subscriptionStatus === SubscriptionStatus.PAUSED
                  ) {
                    return "Subscription paused";
                  }
                  if (
                    teamData?.subscriptionStatus ===
                    SubscriptionStatus.CANCELLED
                  ) {
                    return "Subscription cancelled";
                  }
                  if (teamData?.stripeSubscriptionId) {
                    return `Status: ${
                      teamData.subscriptionStatus || "Unknown"
                    }`;
                  }
                  return "No active subscription";
                })()}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={customerPortalAction}>
                <Button type="submit" variant="outline">
                  View History
                </Button>
              </form>
              <Button
                variant="default"
                onClick={() =>
                  (window.location.href = "/app/settings/subscription")
                }
              >
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembersSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4 mt-1">
          <div className="flex items-center space-x-4">
            <div className="size-8 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded"></div>
              <div className="h-3 w-14 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
    return user.name || user.email || "Unknown User";
  };

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team members yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {/* 
                    This app doesn't save profile images, but here
                    is how you'd show them:

                    <AvatarImage
                      src={member.user.image || ''}
                      alt={getUserDisplayName(member.user)}
                    />
                  */}
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {getUserDisplayName(member.user)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member.role}
                  </p>
                </div>
              </div>
              {index > 1 ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isRemovePending}
                  >
                    {isRemovePending ? "Removing..." : "Remove"}
                  </Button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {removeState?.error && (
          <p className="text-destructive mt-4">{removeState.error}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMemberSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
    </Card>
  );
}

function InviteTeamMember() {
  const { data: teamData } = useSWR<
    TeamDataWithMembers & { currentUserRole?: string }
  >("/api/team", fetcher);
  const isOwner = teamData?.currentUserRole === "owner";
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="invite-form" action={inviteAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
              disabled={!isOwner}
            />
          </div>
          <div className="flex items-center justify-between">
          <div>
            <Label>Role</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" disabled={isInvitePending || !isOwner}>
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
          </div>
          {inviteState?.error && (
            <p className="text-destructive">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-primary">{inviteState.success}</p>
          )}
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: teamData } = useSWR<
    TeamDataWithMembers & { currentUserRole?: string }
  >("/api/team", fetcher);

  useEffect(() => {
    if (teamData && teamData.currentUserRole !== "owner") {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  // Don't render if not owner (will redirect)
  if (teamData && teamData.currentUserRole !== "owner") {
    return null;
  }

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Team Settings
      </h1>
      <Suspense fallback={<TeamInfoSkeleton />}>
        <TeamInfo />
      </Suspense>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <ManageSubscription />
      </Suspense>
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembers />
      </Suspense>
      <Suspense fallback={<InviteTeamMemberSkeleton />}>
        <InviteTeamMember />
      </Suspense>
      <Suspense fallback={null}>
        <InvitationsTableWrapper />
      </Suspense>
    </>
  );
}

function InvitationsTableWrapper() {
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);

  if (!teamData?.id) {
    return null;
  }

  return <InvitationsTable teamId={teamData.id} />;
}
