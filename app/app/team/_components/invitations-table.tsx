"use client";

import { useEffect, useTransition } from "react";
import { startTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Mail } from "lucide-react";
import {
  deleteInvitation,
  resendInvitation,
} from "@/app/(public)/(auth)/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { useActionState } from "react";
import type { ActionState } from "@/lib/auth/proxy";
import { formatDistanceToNow } from "date-fns";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface InvitationWithInviter {
  id: number;
  email: string;
  role: string;
  status: string;
  invitedAt: string;
  invitedBy: {
    id: number;
    name: string | null;
    email: string;
  };
}

interface InvitationsTableProps {
  teamId: number;
}

export function InvitationsTable({ teamId }: InvitationsTableProps) {
  const { data: invitations, mutate } = useSWR<InvitationWithInviter[]>(
    `/api/team/invitations`,
    fetcher
  );

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteInvitation, {});

  const [resendState, resendAction, isResendPending] = useActionState<
    ActionState,
    FormData
  >(resendInvitation, {});

  useToastAction(deleteState);
  useToastAction(resendState);

  useEffect(() => {
    if (deleteState?.success || resendState?.success) {
      mutate();
    }
  }, [deleteState?.success, resendState?.success, mutate]);

  if (!invitations || invitations.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Manage invitations sent to team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">
                  {invitation.email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {invitation.role}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {invitation.invitedBy.name || invitation.invitedBy.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(invitation.invitedAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {invitation.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isResendPending}
                          onClick={() => {
                            const formData = new FormData();
                            formData.append(
                              "invitationId",
                              String(invitation.id)
                            );
                            startTransition(() => {
                              resendAction(formData);
                            });
                          }}
                        >
                          {isResendPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isDeletePending}
                            >
                              {isDeletePending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Invitation?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the invitation
                                sent to {invitation.email}? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={isDeletePending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                  const formData = new FormData();
                                  formData.append(
                                    "invitationId",
                                    String(invitation.id)
                                  );
                                  startTransition(() => {
                                    deleteAction(formData);
                                  });
                                }}
                              >
                                {isDeletePending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

