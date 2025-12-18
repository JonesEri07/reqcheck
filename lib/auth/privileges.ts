"use server";

import { getUser } from "@/lib/db/queries";
import { getCurrentUserTeamMember } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export type TeamRole = "owner" | "member" | null;

/**
 * Get the current user's team member record with role
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @returns Team member record with role, or null if not a member
 */
export async function getCurrentUserTeamMemberRole(
  teamId?: number
): Promise<TeamRole> {
  const teamMember = await getCurrentUserTeamMember(teamId);
  return (teamMember?.role as TeamRole) || null;
}

/**
 * Check if the current user is a member of a team
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @returns true if user is a team member, false otherwise
 */
export async function isTeamMember(teamId?: number): Promise<boolean> {
  const teamMember = await getCurrentUserTeamMember(teamId);
  return teamMember !== null;
}

/**
 * Check if the current user is an owner of a team
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @returns true if user is a team owner, false otherwise
 */
export async function isTeamOwner(teamId?: number): Promise<boolean> {
  const teamMember = await getCurrentUserTeamMember(teamId);
  return teamMember?.role === "owner";
}

/**
 * Get the current user's role in a team
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @returns "owner" | "member" | null
 */
export async function getUserTeamRole(
  teamId?: number
): Promise<TeamRole> {
  return getCurrentUserTeamMemberRole(teamId);
}

/**
 * Server-side function that throws an error if user is not a team owner
 * Use this in server actions to enforce ownership requirements
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @throws Error if user is not an owner
 */
export async function requireTeamOwner(teamId?: number): Promise<void> {
  const isOwner = await isTeamOwner(teamId);
  if (!isOwner) {
    throw new Error("You must be a team owner to perform this action");
  }
}

/**
 * Server-side function that throws an error if user is not a team member
 * Use this in server actions to enforce membership requirements
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @throws Error if user is not a member
 */
export async function requireTeamMember(teamId?: number): Promise<void> {
  const isMember = await isTeamMember(teamId);
  if (!isMember) {
    throw new Error("You must be a team member to perform this action");
  }
}

/**
 * Server-side function that redirects if user is not a team owner
 * Use this in page components to redirect unauthorized users
 * @param redirectTo Optional redirect path. Defaults to "/app/settings/general"
 * @param teamId Optional team ID. If not provided, uses user's current team
 */
export async function requireTeamOwnerOrRedirect(
  redirectTo: string = "/app/settings/general",
  teamId?: number
): Promise<void> {
  const isOwner = await isTeamOwner(teamId);
  if (!isOwner) {
    redirect(redirectTo);
  }
}

