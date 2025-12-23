/**
 * Rate limiting utility for hosted quiz page
 * In-memory implementation (can be upgraded to Redis later)
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// In-memory storage for rate limits
const ipRateLimits = new Map<string, RateLimitEntry>();
const emailRateLimits = new Map<string, RateLimitEntry>();

// Cleanup interval to remove expired entries
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

// Run cleanup on startup and periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    cleanupExpiredEntries();
  }, CLEANUP_INTERVAL);
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();

  // Cleanup IP rate limits
  for (const [ip, entry] of ipRateLimits.entries()) {
    if (entry.resetAt < now) {
      ipRateLimits.delete(ip);
    }
  }

  // Cleanup email rate limits
  for (const [email, entry] of emailRateLimits.entries()) {
    if (entry.resetAt < now) {
      emailRateLimits.delete(email);
    }
  }
}

/**
 * Check if IP or email is rate limited
 * @param ip - IP address
 * @param email - Email address (optional)
 * @returns Object with `limited` boolean and `resetAt` timestamp if limited
 */
export function checkRateLimit(
  ip: string,
  email?: string
): { limited: boolean; resetAt?: number; reason?: string } {
  const now = Date.now();

  // Check IP rate limit (10 attempts per hour)
  const ipEntry = ipRateLimits.get(ip);
  if (ipEntry) {
    if (ipEntry.resetAt > now) {
      if (ipEntry.count >= 10) {
        return {
          limited: true,
          resetAt: ipEntry.resetAt,
          reason: "IP rate limit exceeded (10 attempts per hour)",
        };
      }
    } else {
      // Reset expired entry
      ipRateLimits.delete(ip);
    }
  }

  // Check email rate limit (1 attempt per 24 hours)
  // Note: This is in addition to the existing 24h cooldown logic in the API
  if (email) {
    const emailEntry = emailRateLimits.get(email.toLowerCase());
    if (emailEntry) {
      if (emailEntry.resetAt > now) {
        if (emailEntry.count >= 1) {
          return {
            limited: true,
            resetAt: emailEntry.resetAt,
            reason: "Email rate limit exceeded (1 attempt per 24 hours)",
          };
        }
      } else {
        // Reset expired entry
        emailRateLimits.delete(email.toLowerCase());
      }
    }
  }

  return { limited: false };
}

/**
 * Record an attempt for rate limiting
 * @param ip - IP address
 * @param email - Email address (optional)
 */
export function recordAttempt(ip: string, email?: string): void {
  const now = Date.now();

  // Record IP attempt (1 hour window)
  const ipEntry = ipRateLimits.get(ip);
  if (ipEntry && ipEntry.resetAt > now) {
    ipEntry.count += 1;
  } else {
    ipRateLimits.set(ip, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour
    });
  }

  // Record email attempt (24 hour window)
  if (email) {
    const emailLower = email.toLowerCase();
    const emailEntry = emailRateLimits.get(emailLower);
    if (emailEntry && emailEntry.resetAt > now) {
      emailEntry.count += 1;
    } else {
      emailRateLimits.set(emailLower, {
        count: 1,
        resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
      });
    }
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Try various headers (common in proxy/load balancer setups)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback (won't work in serverless, but useful for development)
  return "unknown";
}

