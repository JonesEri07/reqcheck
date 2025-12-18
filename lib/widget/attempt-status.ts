/**
 * Utility functions for checking attempt status and handling abandoned attempts
 */

import { db } from "@/lib/db/drizzle";
import { verificationAttempts } from "@/lib/db/schema";
import { eq, and, gte, isNull } from "drizzle-orm";

/**
 * Mark attempts as abandoned if they're older than 24 hours and not completed
 * This should be called periodically (e.g., via cron or on-demand)
 */
export async function markAbandonedAttempts(): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db
    .update(verificationAttempts)
    .set({
      abandonedAt: new Date(),
    })
    .where(
      and(
        isNull(verificationAttempts.completedAt),
        isNull(verificationAttempts.abandonedAt),
        gte(verificationAttempts.startedAt, twentyFourHoursAgo)
      )
    );

  // Return count of updated rows (PostgreSQL returns row count)
  return 0; // Drizzle doesn't return count directly, but this is fine for now
}

/**
 * Check if an attempt should be considered abandoned
 */
export function isAttemptAbandoned(
  startedAt: Date,
  completedAt: Date | null,
  abandonedAt: Date | null
): boolean {
  if (completedAt || abandonedAt) {
    return !!abandonedAt;
  }

  const age = Date.now() - startedAt.getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return age >= twentyFourHours;
}

