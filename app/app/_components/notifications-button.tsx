"use client";

import { useState, useTransition, useActionState } from "react";
import {
  Bell,
  Cog,
  UserPlus,
  Briefcase,
  Mail,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import {
  markAllNotificationsAsRead,
  acceptTeamInvitation,
  markNotificationAsRead,
} from "../(app)/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NotificationType } from "@/lib/db/schema";
import { useToastAction } from "@/lib/utils/use-toast-action";
import type { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NotificationData {
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    status: string;
    createdAt: Date;
    metadata: any;
    job: {
      id: string;
      title: string;
    } | null;
    verificationAttempt: {
      id: string;
      email: string;
    } | null;
  }>;
  unreadCount: number;
}

export function NotificationsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [acceptState, acceptAction, isAcceptPending] = useActionState<
    ActionState,
    FormData
  >(acceptTeamInvitation, {});

  useToastAction(acceptState);

  // Always fetch to get unread count, refresh when dropdown opens
  const { data, mutate } = useSWR<NotificationData>(
    "/api/notifications",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Fetch user teams to check if invitations are already accepted
  const { data: userTeamsData, mutate: mutateUserTeams } = useSWR<{
    teams: Array<{ id: number }>;
  }>("/api/user/teams", fetcher);

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const userTeamIds = new Set(
    userTeamsData?.teams?.map((team) => team.id) || []
  );

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsAsRead();
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("All notifications marked as read");
      mutate(); // Refresh notifications
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    startTransition(async () => {
      const result = await markNotificationAsRead(notificationId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        mutate(); // Refresh notifications
      }
    });
  };

  const handleAcceptInvitation = (notificationId: string) => {
    const formData = new FormData();
    formData.append("notificationId", notificationId);
    startTransition(() => {
      acceptAction(formData);
    });
  };

  // Refresh notifications and user teams after accepting invitation
  if (acceptState?.success) {
    mutate();
    mutateUserTeams();
    setTimeout(() => {
      router.refresh();
    }, 1000);
  }

  const getNotificationActions = (
    notification: NotificationData["notifications"][0]
  ) => {
    const actions = [];

    switch (notification.type) {
      case NotificationType.TEAM_INVITATION:
        // Check if user is already a member of the invited team
        const metadata = notification.metadata as {
          invitationTeamId?: number;
        } | null;
        const invitationTeamId = metadata?.invitationTeamId;
        const isAlreadyMember =
          invitationTeamId && userTeamIds.has(invitationTeamId);

        if (isAlreadyMember) {
          // Show accepted state
          actions.push(
            <Badge key="accepted" variant="secondary" className="gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              Accepted
            </Badge>
          );
        } else {
          // Show accept button
          actions.push(
            <Button
              key="accept"
              variant="default"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAcceptInvitation(notification.id);
              }}
              disabled={isPending || isAcceptPending}
              className="gap-2"
            >
              {isAcceptPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <UserPlus className="h-3 w-3" />
              )}
              Accept
            </Button>
          );
        }
        break;

      case NotificationType.APPLICATION_RECEIVED:
      case NotificationType.APPLICATION_VERIFIED:
        if (notification.verificationAttempt?.id) {
          actions.push(
            <Button
              key="view"
              variant="outline"
              size="sm"
              asChild
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="gap-2"
            >
              <Link
                href={`/app/applications/${notification.verificationAttempt.id}`}
              >
                <Mail className="h-3 w-3" />
                View Application
              </Link>
            </Button>
          );
        }
        break;

      case NotificationType.JOB_POSTED:
      case NotificationType.JOB_UPDATED:
        if (notification.job?.id) {
          actions.push(
            <Button
              key="view"
              variant="outline"
              size="sm"
              asChild
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="gap-2"
            >
              <Link href={`/app/jobs/${notification.job.id}`}>
                <Briefcase className="h-3 w-3" />
                View Job
              </Link>
            </Button>
          );
        }
        break;

      case NotificationType.INTEGRATION_SYNC_COMPLETE:
        actions.push(
          <Button
            key="view"
            variant="outline"
            size="sm"
            asChild
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="gap-2"
          >
            <Link href="/app/integrations">
              <ExternalLink className="h-3 w-3" />
              View Integrations
            </Link>
          </Button>
        );
        break;
    }

    // Add mark as read button for unread notifications
    if (notification.status === "UNREAD") {
      actions.push(
        <Button
          key="mark-read"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMarkAsRead(notification.id);
          }}
          disabled={isPending}
          className="h-7 text-xs"
        >
          Mark as read
        </Button>
      );
    }

    return actions;
  };

  const displayNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <span className="font-semibold">Notifications</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/app/user-settings/notifications")}
          >
            <Cog className="h-4 w-4" />
          </Button>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="h-7 text-xs"
          >
            Mark all as read
          </Button>
        )}
        <Separator />
        {displayNotifications.length > 0 ? (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {displayNotifications.map((notification) => {
                const link = notification.job
                  ? `/app/jobs/${notification.job.id}`
                  : notification.verificationAttempt
                    ? `/app/applications/${notification.verificationAttempt.id}`
                    : null;

                const actions = getNotificationActions(notification);
                const hasActions = actions.length > 0;

                const isRead = notification.status === "READ";
                const content = (
                  <div className="p-3 hover:bg-accent transition-colors">
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isRead) {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        disabled={isPending || isRead}
                        className="mt-1 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        title={
                          isRead ? "Marked as read" : "Click to mark as read"
                        }
                        aria-label={isRead ? "Read" : "Unread"}
                      >
                        <div
                          className={`relative aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-all ${
                            isRead
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/50 bg-transparent"
                          }`}
                        >
                          {isRead && (
                            <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </div>
                        {notification.job && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Job: {notification.job.title}
                          </div>
                        )}
                        {notification.verificationAttempt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Applicant: {notification.verificationAttempt.email}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </div>
                        {hasActions && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {actions}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={notification.id}>
                    {link ? (
                      <Link
                        href={link}
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        )}
        <Separator />
        <div className="p-2">
          <Link
            href="/app/notifications"
            className="text-sm text-primary hover:underline flex items-center justify-center"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
