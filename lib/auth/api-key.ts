/**
 * API Key authentication utilities
 */
import { db } from "@/lib/db/drizzle";
import { teamApiKeys } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { compare } from "bcryptjs";
import { normalizeEmail } from "@/lib/utils/email";

/**
 * Verify API key and return team ID
 */
export async function verifyApiKey(apiKey: string): Promise<number | null> {
  if (!apiKey || !apiKey.startsWith("req_")) {
    return null;
  }

  // Get all active API keys (not revoked)
  const keys = await db
    .select()
    .from(teamApiKeys)
    .where(isNull(teamApiKeys.revokedAt));

  // Try to match the key
  for (const key of keys) {
    try {
      const isValid = await compare(apiKey, key.hashedKey);
      if (isValid) {
        // Update last used timestamp
        await db
          .update(teamApiKeys)
          .set({ lastUsedAt: new Date() })
          .where(eq(teamApiKeys.id, key.id));

        return key.teamId;
      }
    } catch (error) {
      // Continue to next key
      continue;
    }
  }

  return null;
}
