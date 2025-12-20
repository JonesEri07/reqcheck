import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { invitations, teams } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { isInvitationExpired } from "@/lib/utils/invitation-token";
import { AcceptInviteClient } from "./_components/accept-invite-client";

async function getInvitationWithTeam(token: string) {
  const [result] = await db
    .select({
      invitation: invitations,
      team: teams,
    })
    .from(invitations)
    .innerJoin(teams, eq(invitations.teamId, teams.id))
    .where(
      and(
        eq(invitations.token, token),
        eq(invitations.status, "pending"),
        gt(invitations.expiresAt, new Date())
      )
    )
    .limit(1);

  return result;
}

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const result = await getInvitationWithTeam(token);

  if (!result) {
    redirect("/sign-in?error=invalid_invitation");
  }

  const { invitation, team } = result;

  if (isInvitationExpired(invitation.expiresAt)) {
    redirect("/sign-in?error=expired_invitation");
  }

  return (
    <Suspense>
      <AcceptInviteClient invitation={invitation} teamName={team.name} />
    </Suspense>
  );
}

