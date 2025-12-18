/**
 * Local Storage utilities for widget
 */

const STORAGE_PREFIX = "reqcheck_";

/**
 * Get stored email for a company/job combination
 */
export function getStoredEmail(
  companyId: string,
  jobId: string
): string | null {
  try {
    const key = `${STORAGE_PREFIX}email_${companyId}_${jobId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored).email : null;
  } catch {
    return null;
  }
}

/**
 * Store email for a company/job combination
 */
export function storeEmail(
  companyId: string,
  jobId: string,
  email: string
): void {
  try {
    const key = `${STORAGE_PREFIX}email_${companyId}_${jobId}`;
    localStorage.setItem(key, JSON.stringify({ email, timestamp: Date.now() }));
  } catch {
    // Ignore storage errors (e.g., private browsing)
  }
}

/**
 * Get stored verification status
 */
export function getStoredStatus(
  companyId: string,
  jobId: string,
  email: string
): { passed: boolean; score: number; timestamp: number } | null {
  try {
    const key = `${STORAGE_PREFIX}status_${companyId}_${jobId}_${email.toLowerCase()}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Store verification status
 */
export function storeStatus(
  companyId: string,
  jobId: string,
  email: string,
  passed: boolean,
  score: number
): void {
  try {
    const key = `${STORAGE_PREFIX}status_${companyId}_${jobId}_${email.toLowerCase()}`;
    localStorage.setItem(
      key,
      JSON.stringify({ passed, score, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
}
