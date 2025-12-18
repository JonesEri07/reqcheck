"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
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
import { markAllNotificationsAsRead } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NotificationData {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    status: string;
    createdAt: Date;
    job: {
      id: string;
      title: string;
    } | null;
    application: {
      id: string;
      email: string;
    } | null;
  }>;
  unreadCount: number;
}

export function NotificationsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Always fetch to get unread count, refresh when dropdown opens
  const { data, mutate } = useSWR<NotificationData>(
    "/api/notifications",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsAsRead();
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("All notifications marked as read");
      mutate(); // Refresh notifications
    }
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
        </div>
        <Separator />
        {displayNotifications.length > 0 ? (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              {displayNotifications.map((notification) => {
                const link = notification.job
                  ? `/app/jobs/${notification.job.id}`
                  : notification.application
                    ? `/app/applications/${notification.application.id}`
                    : null;

                const content = (
                  <div className="p-3 hover:bg-accent transition-colors">
                    <div className="flex items-start gap-2">
                      <div
                        className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                          notification.status === "UNREAD"
                            ? "bg-primary"
                            : "bg-transparent"
                        }`}
                      />
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
                        {notification.application && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Applicant: {notification.application.email}
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
