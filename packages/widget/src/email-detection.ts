/**
 * Smart Email Detection
 * Monitors email fields and shows appropriate UI indicators
 */

import { checkStatus } from "./api";
import {
  getStoredEmail,
  storeEmail,
  getStoredStatus,
  storeStatus,
} from "./storage";

export interface EmailFieldIndicator {
  showCheckmark: boolean;
  showCTA: boolean;
  showWarning: boolean;
  warningMessage?: string;
  ctaText?: string;
}

/**
 * Check email status and return appropriate indicator
 */
export async function checkEmailStatus(
  email: string,
  companyId: string,
  jobId: string
): Promise<EmailFieldIndicator> {
  if (!email || !email.includes("@") || !jobId || !companyId) {
    return { showCheckmark: false, showCTA: false, showWarning: false };
  }

  const emailLower = email.toLowerCase().trim();

  // Check stored status first (fast path)
  const storedStatus = getStoredStatus(companyId, jobId, emailLower);
  if (storedStatus) {
    const age = Date.now() - storedStatus.timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (storedStatus.passed && age < oneDay) {
      // Passed within 24h - show checkmark
      return {
        showCheckmark: true,
        showCTA: false,
        showWarning: false,
      };
    } else if (!storedStatus.passed && age < oneDay) {
      // Failed within 24h - show warning
      const hoursRemaining = Math.ceil((oneDay - age) / (60 * 60 * 1000));
      return {
        showCheckmark: false,
        showCTA: false,
        showWarning: true,
        warningMessage: `Try again in ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}`,
      };
    }
  }

  // Check backend status
  try {
    const status = await checkStatus(companyId, jobId, emailLower);

    // Store status for future use
    storeStatus(companyId, jobId, emailLower, status.passed, status.score);

    if (status.verified && status.passed) {
      // Already passed - show checkmark
      return {
        showCheckmark: true,
        showCTA: false,
        showWarning: false,
      };
    } else if (status.verified && !status.passed) {
      // Failed - check if within 24h cooldown
      if (status.completedAt) {
        const completedTime = new Date(status.completedAt).getTime();
        const age = Date.now() - completedTime;
        const oneDay = 24 * 60 * 60 * 1000;

        if (age < oneDay) {
          const hoursRemaining = Math.ceil((oneDay - age) / (60 * 60 * 1000));
          return {
            showCheckmark: false,
            showCTA: false,
            showWarning: true,
            warningMessage: `Try again in ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}`,
          };
        }
      }
    }

    // No attempt or attempt expired - show CTA
    return {
      showCheckmark: false,
      showCTA: true,
      showWarning: false,
      ctaText: "Start Verification",
    };
  } catch (error) {
    // On error, show CTA as fallback
    return {
      showCheckmark: false,
      showCTA: true,
      showWarning: false,
      ctaText: "Start Verification",
    };
  }
}

/**
 * Create UI indicator element
 */
export function createIndicator(
  indicator: EmailFieldIndicator,
  onCTAClick: () => void
): HTMLElement | null {
  const container = document.createElement("div");
  container.className = "reqcheck-email-indicator";
  container.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
  `;

  if (indicator.showCheckmark) {
    const checkmark = document.createElement("span");
    checkmark.textContent = "✓";
    checkmark.style.cssText = `
      color: #10b981;
      font-weight: bold;
      font-size: 1.25rem;
    `;
    const text = document.createElement("span");
    text.textContent = "Verified";
    text.style.cssText = "color: #10b981;";
    container.appendChild(checkmark);
    container.appendChild(text);
    return container;
  }

  if (indicator.showWarning) {
    const warning = document.createElement("span");
    warning.textContent = "⚠";
    warning.style.cssText = `
      color: #f59e0b;
      font-size: 1.25rem;
    `;
    const text = document.createElement("span");
    text.textContent = indicator.warningMessage || "Try again later";
    text.style.cssText = "color: #f59e0b;";
    container.appendChild(warning);
    container.appendChild(text);
    return container;
  }

  if (indicator.showCTA) {
    const button = document.createElement("button");
    button.textContent = indicator.ctaText || "Start Verification";
    button.type = "button";
    button.style.cssText = `
      padding: 0.5rem 1rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    `;
    button.onclick = (e) => {
      e.preventDefault();
      onCTAClick();
    };
    container.appendChild(button);
    return container;
  }

  return null;
}

/**
 * Attach email detection to an email field
 */
export function attachEmailDetection(
  field: HTMLInputElement,
  companyId: string,
  jobId: string,
  onVerify: (email: string) => void
): void {
  let currentIndicator: HTMLElement | null = null;
  let debounceTimer: number | null = null;

  const checkEmail = async () => {
    const email = field.value.trim();

    // Remove existing indicator
    if (currentIndicator && currentIndicator.parentNode) {
      currentIndicator.parentNode.removeChild(currentIndicator);
      currentIndicator = null;
    }

    if (!email || !email.includes("@")) {
      return;
    }

    // Check stored email
    const storedEmail = getStoredEmail(companyId, jobId);
    if (storedEmail && storedEmail.toLowerCase() !== email.toLowerCase()) {
      // Email changed - check new email status
      const indicator = await checkEmailStatus(email, companyId, jobId);
      const indicatorEl = createIndicator(indicator, () => onVerify(email));
      if (indicatorEl) {
        // Insert after field or its parent
        const parent = field.parentElement;
        if (parent) {
          parent.appendChild(indicatorEl);
          currentIndicator = indicatorEl;
        }
      }
    } else if (!storedEmail) {
      // No stored email - check status
      const indicator = await checkEmailStatus(email, companyId, jobId);
      const indicatorEl = createIndicator(indicator, () => onVerify(email));
      if (indicatorEl) {
        const parent = field.parentElement;
        if (parent) {
          parent.appendChild(indicatorEl);
          currentIndicator = indicatorEl;
        }
      }
    } else {
      // Same email - use stored status
      const storedStatus = getStoredStatus(
        companyId,
        jobId,
        email.toLowerCase()
      );
      if (storedStatus) {
        const age = Date.now() - storedStatus.timestamp;
        const oneDay = 24 * 60 * 60 * 1000;

        if (storedStatus.passed && age < oneDay) {
          const indicatorEl = createIndicator(
            { showCheckmark: true, showCTA: false, showWarning: false },
            () => onVerify(email)
          );
          if (indicatorEl) {
            const parent = field.parentElement;
            if (parent) {
              parent.appendChild(indicatorEl);
              currentIndicator = indicatorEl;
            }
          }
        }
      }
    }

    // Store email
    storeEmail(companyId, jobId, email);
  };

  // Debounced blur handler
  field.addEventListener("blur", () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(checkEmail, 300);
  });

  // Also check on input if field already has value
  if (field.value) {
    checkEmail();
  }
}
