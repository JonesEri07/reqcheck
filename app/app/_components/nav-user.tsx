"use client";

import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/(public)/(auth)/actions";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/schema";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenuContent() {
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const router = useRouter();

  if (!user) {
    return null;
  }

  async function handleSignOut() {
    await signOut();
    mutate("/api/user");
    router.push("/");
  }

  const avatar = (
    <Avatar className="cursor-pointer size-8">
      <AvatarImage alt={user.name || ""} />
      <AvatarFallback>
        {user.email
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/app" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
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
  );
}

export function NavUser() {
  return (
    <Suspense fallback={<div className="h-8 w-8 rounded-full bg-muted" />}>
      <UserMenuContent />
    </Suspense>
  );
}
