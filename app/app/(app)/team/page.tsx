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
import { useActionState, useEffect, useState, startTransition } from "react";
import { TeamDataWithMembers, User } from "@/lib/db/schema";
import {
  removeTeamMember,
  updateTeamMemberRole,
  inviteTeamMember,
  updateTeamName,
} from "@/app/(public)/(auth)/actions";
import useSWR from "swr";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  PlusCircle,
  Edit2,
  Check,
  X,
  MoreVertical,
  Trash2,
  UserCog,
} from "lucide-react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { ActionState } from "@/lib/auth/proxy";
import { InvitationsTable } from "./_components/invitations-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const { data: teamData, mutate } = useSWR<
    TeamDataWithMembers & { currentUserRole?: string }
  >("/api/team", fetcher);
  const { data: currentUser } = useSWR<User>("/api/user", fetcher);
  const isOwner = teamData?.currentUserRole === "owner";
  const currentUserId = currentUser?.id;

  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  const [updateRoleState, updateRoleAction, isUpdateRolePending] =
    useActionState<ActionState, FormData>(updateTeamMemberRole, {});

  const [memberToRemove, setMemberToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [memberToUpdateRole, setMemberToUpdateRole] = useState<{
    id: number;
    name: string;
    currentRole: string;
    newRole: string;
  } | null>(null);

  useToastAction(removeState);
  useToastAction(updateRoleState);

  // Refresh team data after successful updates
  useEffect(() => {
    if (removeState?.success || updateRoleState?.success) {
      mutate();
      setMemberToRemove(null);
      setMemberToUpdateRole(null);
    }
  }, [removeState?.success, updateRoleState?.success, mutate]);

  const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
    return user.name || user.email || "Unknown User";
  };

  const handleRoleChange = (memberId: number, newRole: string) => {
    const member = teamData?.teamMembers.find((m) => m.id === memberId);
    if (!member) return;

    if (member.role === newRole) return;

    setMemberToUpdateRole({
      id: memberId,
      name: getUserDisplayName(member.user),
      currentRole: member.role,
      newRole,
    });
  };

  const confirmRoleUpdate = () => {
    if (!memberToUpdateRole) return;
    startTransition(() => {
      const formData = new FormData();
      formData.append("memberId", memberToUpdateRole.id.toString());
      formData.append("role", memberToUpdateRole.newRole);
      updateRoleAction(formData);
    });
  };

  const confirmRemove = () => {
    if (!memberToRemove) return;
    startTransition(() => {
      const formData = new FormData();
      formData.append("memberId", memberToRemove.id.toString());
      removeAction(formData);
    });
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
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.teamMembers.map((member) => {
              const isCurrentUser = member.user.id === currentUserId;
              const canManage = isOwner && !isCurrentUser;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar>
                      <AvatarFallback>
                        {getUserDisplayName(member.user)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {getUserDisplayName(member.user)}
                        </p>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {canManage ? (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleRoleChange(member.id, value)
                          }
                          disabled={isUpdateRolePending}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                setMemberToRemove({
                                  id: member.id,
                                  name: getUserDisplayName(member.user),
                                })
                              }
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{memberToRemove?.name}</strong> from your team? They will
              lose access to all team resources immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToRemove(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              disabled={isRemovePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Member"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Role Confirmation Dialog */}
      <AlertDialog
        open={!!memberToUpdateRole}
        onOpenChange={(open) => !open && setMemberToUpdateRole(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Team Member Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change{" "}
              <strong>{memberToUpdateRole?.name}</strong>'s role from{" "}
              <strong className="capitalize">
                {memberToUpdateRole?.currentRole}
              </strong>{" "}
              to{" "}
              <strong className="capitalize">
                {memberToUpdateRole?.newRole}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToUpdateRole(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleUpdate}
              disabled={isUpdateRolePending}
            >
              {isUpdateRolePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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

export default function TeamPage() {
  const router = useRouter();
  const { data: teamData } = useSWR<
    TeamDataWithMembers & { currentUserRole?: string }
  >("/api/team", fetcher);

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
        Team Settings
      </h1>
      <Suspense fallback={<TeamInfoSkeleton />}>
        <TeamInfo />
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
