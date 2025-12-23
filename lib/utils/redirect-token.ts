/**
 * Redirect token utilities for hosted quiz page
 * Uses JWT to sign redirect URLs for secure per-instance handling
 */

import { SignJWT, jwtVerify } from "jose";

const key = new TextEncoder().encode(
  process.env.REDIRECT_SECRET || process.env.AUTH_SECRET
);

export type RedirectTokenPayload = {
  redirectPass: string;
  redirectFail: string;
  attemptId: string;
  companyId: number;
  jobId: string;
  expiresAt: string;
};

/**
 * Sign redirect URLs into a JWT token
 */
export async function signRedirectToken(
  payload: Omit<RedirectTokenPayload, "expiresAt">
): Promise<string> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const tokenPayload: RedirectTokenPayload = {
    ...payload,
    expiresAt: expiresAt.toISOString(),
  };

  return await new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

/**
 * Verify redirect token and extract payload
 */
export async function verifyRedirectToken(
  token: string
): Promise<RedirectTokenPayload> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });

  // Check expiration
  const expiresAt = new Date(payload.expiresAt as string);
  if (expiresAt < new Date()) {
    throw new Error("Redirect token has expired");
  }

  return payload as RedirectTokenPayload;
}

/**
 * Validate redirect URL format
 * - Must be HTTPS
 * - Must be valid URL format
 */
export function validateRedirectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow HTTPS (except localhost for development)
    if (
      urlObj.protocol !== "https:" &&
      !(
        process.env.NODE_ENV === "development" &&
        (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1")
      )
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

