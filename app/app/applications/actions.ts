"use server";

import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { applications } from "@/lib/db/schema";
import { validatedActionWithUser, type ActionState } from "@/lib/auth/proxy";
import { getTeamForUser } from "@/lib/db/queries";

const updateApplicationStatusSchema = z.object({
  id: z.string().uuid(),
  verified: z.boolean().optional(),
});

export const updateApplicationStatus = validatedActionWithUser(
  updateApplicationStatusSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify application belongs to team
    const existingApplication = await db
      .select()
      .from(applications)
      .where(
        and(eq(applications.id, data.id), eq(applications.teamId, team.id))
      )
      .limit(1);

    if (existingApplication.length === 0) {
      return { error: "Application not found" } as ActionState;
    }

    const updateFields: any = {};

    if (data.verified !== undefined) {
      updateFields.verified = data.verified;
    }

    await db
      .update(applications)
      .set(updateFields)
      .where(eq(applications.id, data.id));

    return {
      success: "Application status updated successfully",
    } as ActionState;
  }
);
