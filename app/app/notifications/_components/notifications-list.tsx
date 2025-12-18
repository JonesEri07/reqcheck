"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  CheckCheck,
  Archive,
  Briefcase,
  Mail,
  Loader2,
  UserPlus,
} from "lucide-react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  acceptTeamInvitation,
} from "../../actions";
import { toast } from "sonner";
import type { NotificationWithRelations } from "@/lib/notifications/queries";
import type { ActionState } from "@/lib/auth/proxy";
import { useToastAction } from "@/lib/utils/use-toast-action";

interface NotificationsListProps {
  notifications: NotificationWithRelations[];
}

export function NotificationsList({
  notifications: initialNotifications,
}: NotificationsListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();
  const [acceptState, acceptAction, isAcceptPending] = useActionState<
    ActionState,
    FormData
  >(acceptTeamInvitation, {});

  useToastAction(acceptState);

  const handleMarkAsRead = async (notificationId: string) => {
    startTransition(async () => {
      const result = await markNotificationAsRead(notificationId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, status: "READ", readAt: new Date() }
              : n
          )
        );
      }
    });
  };

  const handleMarkAllAsRead = async () => {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead();
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            status: "READ",
            readAt: n.readAt || new Date(),
          }))
        );
        toast.success("All notifications marked as read");
      }
    });
  };

  const handleArchive = async (notificationId: string) => {
    startTransition(async () => {
      const result = await archiveNotification(notificationId);
      if (!("error" in result)) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    });
  };

  // Handle accept invitation success - refresh page and remove notification
  useEffect(() => {
    if (acceptState?.success) {
      // Remove accepted notifications from the list
      setNotifications((prev) =>
        prev.filter((n) => n.type !== "TEAM_INVITATION" || n.status === "READ")
      );
      // Refresh the page to update team data
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [acceptState?.success]);

  const handleAcceptInvitation = (notificationId: string) => {
    const formData = new FormData();
    formData.append("notificationId", notificationId);
    startTransition(() => {
      acceptAction(formData);
    });
  };

  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;
  const unreadNotifications = notifications.filter(
    (n) => n.status === "UNREAD"
  );
  const readNotifications = notifications.filter((n) => n.status === "READ");

  const getNotificationLink = (notification: NotificationWithRelations) => {
    if (notification.jobId) {
      return `/app/jobs/${notification.jobId}`;
    }
    if (notification.verificationAttemptId) {
      return `/app/applications/${notification.verificationAttemptId}`;
    }
    return null;
  };

  const getNotificationIcon = (notification: NotificationWithRelations) => {
    if (notification.jobId) {
      return <Briefcase className="h-4 w-4" />;
    }
    if (notification.verificationAttemptId) {
      return <Mail className="h-4 w-4" />;
    }
    return null;
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            You don't have any notifications yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No notifications to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      {unreadCount > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mark all as read to clear the notification badge
                </p>
              </div>
              <Button
                onClick={handleMarkAllAsRead}
                disabled={isPending}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}
                Mark all as read
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unread</CardTitle>
            <CardDescription>
              {unreadNotifications.length} unread notification
              {unreadNotifications.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {unreadNotifications.map((notification, index) => {
                const link = getNotificationLink(notification);
                const icon = getNotificationIcon(notification);
                const NotificationContent = (
                  <div className="p-4 hover:bg-accent transition-colors">
                    <div className="flex items-start gap-3">
                      {icon && (
                        <div className="mt-0.5 text-muted-foreground">
                          {icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                              {notification.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {notification.job && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.job.title}
                                </Badge>
                              )}
                              {notification.verificationAttempt && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.verificationAttempt.email}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {notification.type === "TEAM_INVITATION" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAcceptInvitation(notification.id);
                                }}
                                disabled={isPending || isAcceptPending}
                                className="gap-2"
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserPlus className="h-4 w-4" />
                                )}
                                Accept
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMarkAsRead(notification.id);
                              }}
                              disabled={isPending}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                handleArchive(notification.id);
                              }}
                              disabled={isPending}
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={notification.id}>
                    {link ? (
                      <Link href={link} className="block">
                        {NotificationContent}
                      </Link>
                    ) : (
                      NotificationContent
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Read</CardTitle>
            <CardDescription>
              {readNotifications.length} read notification
              {readNotifications.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {readNotifications.map((notification) => {
                const link = getNotificationLink(notification);
                const icon = getNotificationIcon(notification);
                const NotificationContent = (
                  <div className="p-4 hover:bg-accent transition-colors opacity-75">
                    <div className="flex items-start gap-3">
                      {icon && (
                        <div className="mt-0.5 text-muted-foreground">
                          {icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                              {notification.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {notification.job && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.job.title}
                                </Badge>
                              )}
                              {notification.verificationAttempt && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.verificationAttempt.email}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {notification.type === "TEAM_INVITATION" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAcceptInvitation(notification.id);
                                }}
                                disabled={isPending || isAcceptPending}
                                className="gap-2"
                              >
                                {isAcceptPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserPlus className="h-4 w-4" />
                                )}
                                Accept
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                handleArchive(notification.id);
                              }}
                              disabled={isPending}
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={notification.id}>
                    {link ? (
                      <Link href={link} className="block">
                        {NotificationContent}
                      </Link>
                    ) : (
                      NotificationContent
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
