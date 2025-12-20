/**
 * Invitation token generation and validation utilities
 */

import crypto from "node:crypto";

/**
 * Generate a secure, URL-safe token for invitations
 * Uses base64url encoding for URL safety
 */
export function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Get invitation expiration time (7 days from now)
 */
export function getInvitationExpiration(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
}

/**
 * Check if invitation token is expired
 */
export function isInvitationExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

