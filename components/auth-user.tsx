"use client";

import { Suspense, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Building2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/schema";
import useSWR, { mutate } from "swr";
import { TeamSwitcherModal } from "@/components/team-switcher-modal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Team = {
  id: number;
  name: string;
  currentUserRole?: string | null;
};

type AuthUserProps = {
  user?: User | null;
  team?: Team | null;
  userEmail?: string;
  userName?: string | null;
  teamName?: string | null;
};

function AuthUserContent({
  user,
  team,
  userEmail,
  userName,
  teamName,
}: AuthUserProps) {
  const router = useRouter();
  const [isTeamSwitcherOpen, setIsTeamSwitcherOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch user and team data if not provided as props
  const { data: fetchedUser } = useSWR<User | null>("/api/user", fetcher, {
    fallbackData: user ?? undefined,
  });
  const { data: fetchedTeam } = useSWR<Team | null>("/api/team", fetcher, {
    fallbackData: team ?? undefined,
  });

  const currentUser = fetchedUser || user;
  const currentTeam = fetchedTeam || team;
  const email = currentUser?.email || userEmail || "";
  const name = currentUser?.name || userName || null;
  const displayTeamName = currentTeam?.name || teamName || "No Team";
  const userRole = currentTeam?.currentUserRole || null;

  if (!currentUser && !userEmail) {
    return null;
  }

  async function handleSignOut() {
    await signOut();
    mutate("/api/user");
    mutate("/api/team");
    router.push("/");
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email.split("@")[0].slice(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="relative flex items-center justify-center">
              <div
                className={
                  userRole === "owner"
                    ? "absolute size-8 bg-accent rotate-45 rounded-md transition-all duration-300"
                    : "absolute size-8 bg-muted rounded-md"
                }
              />
              <Avatar className="relative size-8">
                <AvatarImage alt={name || email} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs text-muted-foreground">
                {displayTeamName}
              </span>
              <span className="text-sm font-medium">{name || email}</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="lg:hidden">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                {displayTeamName && (
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {displayTeamName}
                  </p>
                )}
                <p className="text-sm font-medium leading-none">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </div>
          <DropdownMenuItem asChild>
            <Link
              href="/app/dashboard"
              className="flex w-full items-center cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/app/user-settings"
              className="flex w-full items-center cursor-pointer"
            >
              <UserCog className="mr-2 h-4 w-4" />
              <span>User Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDropdownOpen(false);
              setIsTeamSwitcherOpen(true);
            }}
            className="cursor-pointer"
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>Switch Team</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={handleSignOut} className="w-full">
            <button type="submit" className="flex w-full">
              <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
      <TeamSwitcherModal
        open={isTeamSwitcherOpen}
        onOpenChange={setIsTeamSwitcherOpen}
      />
    </>
  );
}

export function AuthUser(props: AuthUserProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="size-8 rounded-full bg-muted animate-pulse" />
          <div className="hidden sm:flex flex-col gap-1">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      }
    >
      <AuthUserContent {...props} />
    </Suspense>
  );
}
