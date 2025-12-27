"use server";

import { validatedAction } from "@/lib/auth/proxy";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { teams, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/auth/session";

const completeOnboardingSchema = z
  .object({
    teamId: z.string().transform((val) => parseInt(val)),
    teamName: z.string().min(1).max(100),
    userName: z.string().min(1).max(100),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const completeOnboardingAction = validatedAction(
  completeOnboardingSchema,
  async (data) => {
    const user = await getUser();
    if (!user) {
      return { error: "You must be logged in to complete onboarding" };
    }

    const team = await getTeamForUser();
    if (!team || team.id !== data.teamId) {
      return { error: "Team not found" };
    }

    if (team.onboardingComplete) {
      redirect("/app/dashboard");
    }

    try {
      // Hash the password
      const passwordHash = await hashPassword(data.password);

      // Update team name and mark onboarding complete
      await db
        .update(teams)
        .set({
          name: data.teamName.trim(),
          onboardingComplete: true,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, data.teamId));

      // Update user name and password
      await db
        .update(users)
        .set({
          name: data.userName.trim(),
          passwordHash: passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      // Redirect to dashboard after successful completion
      redirect("/app/dashboard");
    } catch (error: any) {
      // Re-throw redirect errors - they should not be caught
      if (error?.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
      return {
        error: error.message || "Failed to complete onboarding",
        teamName: data.teamName,
        userName: data.userName,
      };
    }
  }
);

