/**
 * ReqCheck Widget
 * Main entry point for the widget
 */

import {
  validateWidget,
  getQuestions,
  startAttempt,
  submitAttempt,
  checkStatus,
  getCurrentAttempt,
  type QuizQuestion,
  type WidgetStyles,
} from "./api";
import { attachEmailDetection } from "./email-detection";
import { storeEmail, storeStatus, getStoredEmail } from "./storage";
import { createOverlay, removeOverlay, updateOverlayToFailed } from "./overlay";
import {
  createModal,
  showEmailStep,
  showQuizStep,
  showResultsStep,
  type ModalResult,
} from "./modal";

export interface WidgetConfig {
  companyId: string;
  jobId: string;
  mode?: "protect" | "gate" | "inline";
  autoInit?: boolean;
  testMode?: boolean;
}

export interface WidgetCallbacks {
  onSuccess?: (result: { passed: boolean; score: number }) => void;
  onFailure?: (result: { passed: boolean; score: number }) => void;
  onComplete?: (result: { passed: boolean; score: number }) => void;
}

class ReqCheckWidget {
  private config: WidgetConfig | null = null;
  private callbacks: WidgetCallbacks = {};
  private initialized = false;
  private protectedElements: Map<HTMLElement, boolean> = new Map(); // Track which elements are protected
  private gateElements: Map<HTMLElement, (e: Event) => void> = new Map(); // Track gate elements and their click handlers
  private widgetStyles: WidgetStyles | null = null; // Backend-provided styles

  /**
   * Get style value with fallback to default
   */
  private getStyle(key: keyof WidgetStyles, defaultValue: string): string {
    return this.widgetStyles?.[key] || defaultValue;
  }

  /**
   * Initialize the widget
   */
  async init(config: WidgetConfig, callbacks: WidgetCallbacks = {}) {
    if (this.initialized) {
      console.warn("ReqCheck widget already initialized");
      return;
    }

    this.config = config;
    this.callbacks = callbacks;

    this.initialized = true;

    // Auto-init if enabled
    if (config.autoInit !== false) {
      this.autoInit();
    }
  }

  /**
   * Validate widget can render for a specific job
   * Returns validation result with config if valid
   */
  private async validateJob(jobId: string): Promise<{
    canRender: boolean;
    config?: { passThreshold: number; questionCount: number; jobId: string };
  }> {
    if (!this.config) return { canRender: false };

    try {
      const validation = await validateWidget(
        this.config.companyId,
        jobId,
        this.config.testMode
      );
      // Store widget styles from backend
      if (validation.widgetStyles) {
        this.widgetStyles = validation.widgetStyles;
      }
      return {
        canRender: validation.canRender === true,
        config: validation.config,
      };
    } catch (error) {
      console.error("Failed to validate widget:", error);
      return { canRender: false };
    }
  }

  /**
   * Hide widget and unblock all protected elements
   */
  private hideWidget(): void {
    // Remove all overlays
    this.protectedElements.forEach((_, element) => {
      removeOverlay(element);
      this.protectedElements.delete(element);
    });

    // Clean up gate elements
    this.gateElements.forEach((handler, element) => {
      element.removeEventListener("click", handler);
      this.gateElements.delete(element);
    });
  }

  /**
   * Auto-initialize widget by scanning for data attributes
   */
  private async autoInit() {
    if (!this.config) return;

    // Find and attach email field detection
    this.attachEmailFields();

    // Find elements with data-reqcheck-mode
    const elements = document.querySelectorAll("[data-reqcheck-mode]");

    for (const element of elements) {
      const mode = element.getAttribute("data-reqcheck-mode");
      const jobId =
        element.getAttribute("data-reqcheck-job") || this.config!.jobId;

      if (!jobId) {
        console.warn("ReqCheck: Element missing data-reqcheck-job attribute");
        continue;
      }

      if (mode === "protect" && element instanceof HTMLFormElement) {
        // Validate widget can render for this job
        const validation = await this.validateJob(jobId);
        if (!validation.canRender) {
          // Silently skip - element works normally
          continue;
        }
        await this.attachToForm(element, jobId);
      } else if (mode === "gate" && element instanceof HTMLElement) {
        // Validate widget can render for this job
        const validation = await this.validateJob(jobId);
        if (!validation.canRender) {
          // Silently skip - element works normally
          continue;
        }
        await this.attachToElement(element, jobId);
      } else if (mode === "inline" && element instanceof HTMLElement) {
        // For inline mode, always try to attach (validation happens inside)
        // This ensures content is rendered even if validation fails
        await this.attachToInlineElement(element, jobId);
      }
    }
  }

  /**
   * Attach email detection to all email fields
   */
  private attachEmailFields() {
    if (!this.config) return;

    const emailFields = document.querySelectorAll<HTMLInputElement>(
      "[data-reqcheck-email-field]"
    );

    emailFields.forEach((field) => {
      // Find associated external job ID (from form or closest data-reqcheck-job)
      const form = field.closest("form");
      const externalJobId =
        field.getAttribute("data-reqcheck-job") ||
        form?.getAttribute("data-reqcheck-job") ||
        form
          ?.querySelector("[data-reqcheck-mode]")
          ?.getAttribute("data-reqcheck-job");

      // Skip if no external job ID found
      if (!externalJobId) {
        return;
      }

      attachEmailDetection(
        field,
        this.config!.companyId,
        externalJobId,
        (email) => {
          // For email detection, find the associated form and trigger protect modal
          const form = field.closest("form");
          if (form && form.hasAttribute("data-reqcheck-mode")) {
            this.showProtectModal(form, externalJobId);
          }
        }
      );
    });
  }

  /**
   * Attach widget to a form (protect mode)
   */
  private async attachToForm(form: HTMLFormElement, jobId: string) {
    // Validate widget can render
    const validation = await this.validateJob(jobId);
    if (!validation.canRender) {
      // Silently hide - form works normally
      console.warn("ReqCheck: Widget validation failed for job", jobId);
      return;
    }

    const passThreshold = validation.config?.passThreshold || 70;

    // Remove any existing overlay before adding a new one
    removeOverlay(form);

    // Make form position relative for overlay
    const computedStyle = getComputedStyle(form);
    if (computedStyle.position === "static") {
      form.style.position = "relative";
    }

    // Ensure form has minimum height for overlay to be visible
    if (!form.style.minHeight && computedStyle.minHeight === "0px") {
      form.style.minHeight = "200px";
    }

    // Check if there's an in-progress attempt (for overlay progress indicator)
    const emailField = form.querySelector<HTMLInputElement>(
      "[data-reqcheck-email-field]"
    );
    const email = emailField?.value || "";
    let showProgress = false;

    if (email) {
      try {
        const currentAttempt = await getCurrentAttempt(
          this.config!.companyId,
          jobId,
          email
        );
        showProgress = currentAttempt.status === "in_progress";
      } catch {
        // Ignore errors
      }
    }

    // Create overlay with backend styles
    const overlay = createOverlay(
      () => {
        this.showProtectModal(form, jobId);
      },
      showProgress,
      this.widgetStyles || undefined
    );
    form.appendChild(overlay);
    this.protectedElements.set(form, true);

    // Block form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.showProtectModal(form, jobId);
    });
  }

  /**
   * Show protect mode modal (email → quiz)
   */
  private async showProtectModal(form: HTMLFormElement, jobId: string) {
    if (!this.config) return;

    // Get email from form if available
    const emailField = form.querySelector<HTMLInputElement>(
      "[data-reqcheck-email-field]"
    );
    const initialEmail = emailField?.value || "";

    // Create modal
    const modal = createModal((result) => {
      document.body.removeChild(modal);

      if (result) {
        if (result.passed) {
          // Unblock form
          removeOverlay(form);
          this.protectedElements.delete(form);

          // Store result
          storeStatus(
            this.config!.companyId,
            jobId,
            initialEmail.toLowerCase(),
            true,
            result.score
          );
          if (initialEmail) {
            storeEmail(this.config!.companyId, jobId, initialEmail);
          }

          this.callbacks.onSuccess?.(result);
        } else {
          // Failed - keep form blocked
          this.callbacks.onFailure?.(result);
        }
        this.callbacks.onComplete?.(result);
      } else {
        // Abandoned - mark attempt as abandoned
        // (handled by timeout in backend)
      }
    }, this.widgetStyles || undefined);

    document.body.appendChild(modal);
    const modalContent = modal.querySelector(
      ".reqcheck-modal-content"
    ) as HTMLElement;

    // Show email step
    showEmailStep(
      modalContent,
      async (email) => {
        try {
          // Check for existing attempt
          const currentAttempt = await getCurrentAttempt(
            this.config!.companyId,
            jobId,
            email
          );

          if (currentAttempt.status === "passed") {
            // Already passed - close modal and unblock
            document.body.removeChild(modal);
            removeOverlay(form);
            this.protectedElements.delete(form);

            this.callbacks.onSuccess?.({
              passed: true,
              score: currentAttempt.attempt?.score || 0,
            });
            return;
          }

          // Get pass threshold from validation (needed for overlay update)
          const validation = await validateWidget(
            this.config!.companyId,
            jobId,
            this.config?.testMode
          );
          const actualPassThreshold = validation.config?.passThreshold || 70;

          if (
            currentAttempt.status === "failed" ||
            currentAttempt.status === "abandoned"
          ) {
            // Update overlay to show failed result
            const score = currentAttempt.attempt?.score || 0;
            updateOverlayToFailed(
              form,
              score,
              actualPassThreshold,
              currentAttempt.timeRemaining,
              this.widgetStyles || undefined
            );

            // Show failure message in modal
            modalContent.innerHTML = "";
            const container = document.createElement("div");
            container.style.cssText = "padding: 3rem 2rem; text-align: center;";

            const title = document.createElement("h2");
            title.textContent = "Verification Failed";
            title.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 1.75rem;
            font-weight: 600;
            color: #dc2626;
          `;

            const message = document.createElement("p");
            const hoursRemaining = currentAttempt.timeRemaining;
            message.textContent = hoursRemaining
              ? `You can try again in ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}.`
              : "You can try again in 24 hours.";
            message.style.cssText = `
            margin: 0 0 2rem 0;
            color: #6b7280;
            font-size: 1rem;
          `;

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Close";
            closeBtn.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: #000000;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
          `;
            closeBtn.onclick = () => {
              document.body.removeChild(modal);
            };

            container.appendChild(title);
            container.appendChild(message);
            container.appendChild(closeBtn);
            modalContent.appendChild(container);
            return;
          }

          // Start or resume attempt
          const attempt = await startAttempt(
            this.config!.companyId,
            jobId,
            email,
            this.config?.testMode
          );

          // Get questions (from attempt if resumed, or from startAttempt response for new attempts)
          let questions: QuizQuestion[] = [];
          let startIndex = 0;
          let existingAnswers: Array<{
            questionId: string;
            answer: string | string[];
          }> = [];

          if (attempt.resumed && currentAttempt.status === "in_progress") {
            // Resume from existing attempt
            // Ensure questionsShown is a valid array with length > 0
            const questionsShownFromAttempt =
              currentAttempt.attempt?.questionsShown;
            if (
              Array.isArray(questionsShownFromAttempt) &&
              questionsShownFromAttempt.length > 0
            ) {
              questions = questionsShownFromAttempt;
              // Answers are stored in order matching questionsShown (may contain nulls for unanswered)
              existingAnswers = (currentAttempt.attempt?.answers || [])
                .filter((a: any) => a !== null && a !== undefined)
                .map((a: any) => ({
                  questionId: a.questionId,
                  answer: a.answer,
                }));
              startIndex = currentAttempt.firstUnansweredIndex || 0;
            } else {
              // Fallback: if questionsShown is missing or empty, use questions from startAttempt
              console.warn(
                "[Widget] questionsShown missing or empty in current attempt, using questions from startAttempt"
              );
              if (attempt.questions && attempt.questions.length > 0) {
                questions = attempt.questions;
              } else {
                // Final fallback: fetch questions
                const quizData = await getQuestions(
                  this.config!.companyId,
                  jobId,
                  email
                );
                questions = quizData.questions;
              }
            }
          } else {
            // New attempt - use questions from startAttempt (they match what's stored in the attempt)
            if (attempt.questions && attempt.questions.length > 0) {
              questions = attempt.questions;
            } else {
              // Fallback: if questions not returned, fetch them (shouldn't happen but handle gracefully)
              console.warn(
                "[Widget] Questions not returned from startAttempt, fetching from API"
              );
              const quizData = await getQuestions(
                this.config!.companyId,
                jobId,
                email
              );
              questions = quizData.questions;
            }
          }

          if (!Array.isArray(questions) || questions.length === 0) {
            alert("No questions available");
            document.body.removeChild(modal);
            return;
          }

          // Show quiz step
          showQuizStep(
            modalContent,
            questions,
            actualPassThreshold,
            attempt.sessionToken,
            attempt.attemptId,
            startIndex,
            existingAnswers,
            async (result) => {
              // Quiz completed
              document.body.removeChild(modal);

              if (result.passed) {
                // Unblock form
                removeOverlay(form);
                this.protectedElements.delete(form);

                this.callbacks.onSuccess?.(result);
              } else {
                // Keep form blocked - update overlay to show failed result
                // Try to get timeRemaining from current attempt status
                let timeRemaining: number | null = null;
                if (initialEmail) {
                  try {
                    const currentAttempt = await getCurrentAttempt(
                      this.config!.companyId,
                      jobId,
                      initialEmail
                    );
                    timeRemaining = currentAttempt.timeRemaining;
                  } catch {
                    // Ignore errors - just use null for timeRemaining
                  }
                }
                updateOverlayToFailed(
                  form,
                  result.score,
                  actualPassThreshold,
                  timeRemaining,
                  this.widgetStyles || undefined
                );
                this.callbacks.onFailure?.(result);
              }
              this.callbacks.onComplete?.(result);
            },
            undefined,
            this.widgetStyles || undefined,
            this.config?.testMode
          );
        } catch (error: any) {
          console.error("Error in protect modal:", error);
          alert(`Error: ${error.message || "Failed to start verification"}`);
          document.body.removeChild(modal);
        }
      },
      this.widgetStyles || undefined
    );
  }

  /**
   * Attach widget to an inline element (inline mode)
   */
  private async attachToInlineElement(element: HTMLElement, jobId: string) {
    if (!this.config) {
      console.error("ReqCheck: Widget not initialized");
      element.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #6b7280;">
          <p>Verification is currently unavailable.</p>
        </div>
      `;
      return;
    }

    if (!jobId) {
      console.error("ReqCheck: No jobId provided for inline element");
      element.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #6b7280;">
          <p>Verification is currently unavailable.</p>
        </div>
      `;
      return;
    }

    // First validate that widget can render for this job
    const validation = await this.validateJob(jobId);
    if (!validation.canRender) {
      // Widget cannot render - show error message in element
      element.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #6b7280;">
          <p>Verification is currently unavailable.</p>
        </div>
      `;
      return;
    }

    // Check for stored email to determine if we should show "Continue" vs "Start"
    const storedEmail = getStoredEmail(this.config.companyId, jobId);
    let showProgress = false;

    if (storedEmail) {
      try {
        const currentAttempt = await getCurrentAttempt(
          this.config.companyId,
          jobId,
          storedEmail
        );
        showProgress = currentAttempt.status === "in_progress";
      } catch {
        // Ignore errors
      }
    }

    // Create inline widget content
    this.renderInlineWidget(element, jobId, showProgress);

    // Store reference to element for later updates
    (element as any).__reqcheckJobId = jobId;
  }

  /**
   * Render inline widget content (same structure as overlay)
   */
  private renderInlineWidget(
    element: HTMLElement,
    jobId: string,
    showProgress: boolean = false
  ) {
    element.innerHTML = "";
    const buttonColor = this.getStyle("buttonColor", "#000000");
    const buttonTextColor = this.getStyle("buttonTextColor", "white");
    element.style.cssText = `
      padding: 2rem;
      background: ${this.getStyle("backgroundColor", "white")};
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    const title = document.createElement("h3");
    title.textContent = "Verification Required";
    title.style.cssText = `
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: ${this.getStyle("fontColor", "#1f2937")};
    `;

    const description = document.createElement("p");
    description.textContent = showProgress
      ? "Required: Continue your verification to be considered for this position."
      : "Required: Complete reqCHECK verification to be considered for this position.";
    description.style.cssText = `
      margin: 0 0 1.5rem 0;
      color: ${this.getStyle("fontColor", "#6b7280")};
      opacity: 0.8;
      font-size: 0.875rem;
    `;

    const button = document.createElement("button");
    button.textContent = showProgress
      ? "Continue Verification"
      : "Start Verification";
    button.style.cssText = `
      padding: 0.75rem 1.5rem;
      background: ${buttonColor};
      color: ${buttonTextColor};
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    `;
    button.onmouseenter = () => {
      button.style.background =
        buttonColor === "#000000" ? "#1f2937" : buttonColor;
    };
    button.onmouseleave = () => {
      button.style.background = buttonColor;
    };
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showInlineModal(element, jobId);
    };

    element.appendChild(title);
    element.appendChild(description);
    element.appendChild(button);
  }

  /**
   * Update inline widget with result (pass/fail)
   */
  private updateInlineWidgetWithResult(
    element: HTMLElement,
    passed: boolean,
    score: number
  ) {
    element.innerHTML = "";
    const accentColor = this.getStyle("accentColor", "#000000");
    const successColor = passed ? accentColor : "#dc2626";
    const errorColor = "#dc2626";
    const successBg = passed ? "#f0fdf4" : "#fef2f2";
    const successBorder = passed ? "#86efac" : "#fca5a5";
    element.style.cssText = `
      padding: 2rem;
      background: ${passed ? successBg : "#fef2f2"};
      border: 2px solid ${passed ? successBorder : "#fca5a5"};
      border-radius: 8px;
      text-align: center;
    `;

    const icon = document.createElement("div");
    icon.textContent = passed ? "✓" : "✗";
    icon.style.cssText = `
      font-size: 3rem;
      margin-bottom: 1rem;
      color: ${passed ? successColor : errorColor};
    `;

    const title = document.createElement("h3");
    title.textContent = passed ? "Verification Passed!" : "Verification Failed";
    title.style.cssText = `
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: ${passed ? successColor : errorColor};
    `;

    const scoreText = document.createElement("p");
    scoreText.textContent = `Score: ${score}%`;
    scoreText.style.cssText = `
      margin: 0 0 1rem 0;
      color: ${this.getStyle("fontColor", "#6b7280")};
      opacity: 0.8;
      font-size: 0.875rem;
    `;

    const message = document.createElement("p");
    message.textContent = passed
      ? "You have successfully completed verification."
      : "You can try again in 24 hours.";
    message.style.cssText = `
      margin: 0;
      color: ${this.getStyle("fontColor", "#6b7280")};
      opacity: 0.8;
      font-size: 0.875rem;
    `;

    element.appendChild(icon);
    element.appendChild(title);
    if (!passed) {
      element.appendChild(scoreText);
    }
    element.appendChild(message);
  }

  /**
   * Show inline mode modal (email → quiz) - same flow as Protect/Gate
   */
  private async showInlineModal(element: HTMLElement, jobId: string) {
    if (!this.config) return;

    // Create modal
    let storedEmail = "";
    let modalOnClose: ((result: ModalResult | null) => void) | null = null;

    const handleModalClose = (result: ModalResult | null) => {
      document.body.removeChild(modal);

      if (result) {
        if (result.passed) {
          // Store result
          if (storedEmail) {
            storeStatus(
              this.config!.companyId,
              jobId,
              storedEmail.toLowerCase(),
              true,
              result.score
            );
          }

          // Update inline widget with success
          this.updateInlineWidgetWithResult(element, true, result.score);

          this.callbacks.onSuccess?.(result);
        } else {
          // Failed - store result and update inline widget
          if (storedEmail) {
            storeStatus(
              this.config!.companyId,
              jobId,
              storedEmail.toLowerCase(),
              false,
              result.score
            );
          }

          // Update inline widget with failure
          this.updateInlineWidgetWithResult(element, false, result.score);

          this.callbacks.onFailure?.(result);
        }
        this.callbacks.onComplete?.(result);
      }
    };

    const modal = createModal(handleModalClose, this.widgetStyles || undefined);
    modalOnClose = handleModalClose;

    document.body.appendChild(modal);
    const modalContent = modal.querySelector(
      ".reqcheck-modal-content"
    ) as HTMLElement;

    // Show email step
    showEmailStep(
      modalContent,
      async (email) => {
        storedEmail = email; // Store email for use in modal close callback
        storeEmail(this.config!.companyId, jobId, email); // Store in localStorage

        try {
          // Check for existing attempt
          const currentAttempt = await getCurrentAttempt(
            this.config!.companyId,
            jobId,
            email
          );

          if (currentAttempt.status === "passed") {
            // Already passed in last 24h - update inline widget immediately
            document.body.removeChild(modal);

            // Store status
            storeStatus(
              this.config!.companyId,
              jobId,
              email.toLowerCase(),
              true,
              currentAttempt.attempt?.score || 0
            );

            // Update inline widget with success
            this.updateInlineWidgetWithResult(
              element,
              true,
              currentAttempt.attempt?.score || 0
            );

            this.callbacks.onSuccess?.({
              passed: true,
              score: currentAttempt.attempt?.score || 0,
            });
            return;
          }

          if (
            currentAttempt.status === "failed" ||
            currentAttempt.status === "abandoned"
          ) {
            // Show failure message with 24h cooldown
            modalContent.innerHTML = "";
            const container = document.createElement("div");
            container.style.cssText = "padding: 3rem 2rem; text-align: center;";

            const title = document.createElement("h2");
            title.textContent = "Verification Failed";
            title.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 1.75rem;
            font-weight: 600;
            color: #dc2626;
          `;

            const message = document.createElement("p");
            const hoursRemaining = currentAttempt.timeRemaining;
            message.textContent = hoursRemaining
              ? `You can try again in ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}.`
              : "You can try again in 24 hours.";
            message.style.cssText = `
            margin: 0 0 2rem 0;
            color: #6b7280;
            font-size: 1rem;
          `;

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Close";
            closeBtn.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: #000000;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
          `;
            closeBtn.onclick = () => {
              document.body.removeChild(modal);
              // Update inline widget with failure
              this.updateInlineWidgetWithResult(
                element,
                false,
                currentAttempt.attempt?.score || 0
              );
            };

            container.appendChild(title);
            container.appendChild(message);
            container.appendChild(closeBtn);
            modalContent.appendChild(container);

            this.callbacks.onFailure?.({
              passed: false,
              score: currentAttempt.attempt?.score || 0,
            });
            return;
          }

          // Get pass threshold from validation
          const validation = await validateWidget(
            this.config!.companyId,
            jobId,
            this.config?.testMode
          );
          const actualPassThreshold = validation.config?.passThreshold || 70;

          // Start or resume attempt
          const attempt = await startAttempt(
            this.config!.companyId,
            jobId,
            email,
            this.config?.testMode
          );

          // Get questions (from attempt if resumed, or from startAttempt response for new attempts)
          let questions: QuizQuestion[] = [];
          let startIndex = 0;
          let existingAnswers: Array<{
            questionId: string;
            answer: string | string[];
          }> = [];

          if (attempt.resumed && currentAttempt.status === "in_progress") {
            // Resume from existing attempt
            // Ensure questionsShown is a valid array with length > 0
            const questionsShownFromAttempt =
              currentAttempt.attempt?.questionsShown;
            if (
              Array.isArray(questionsShownFromAttempt) &&
              questionsShownFromAttempt.length > 0
            ) {
              questions = questionsShownFromAttempt;
              // Answers are stored in order matching questionsShown (may contain nulls for unanswered)
              existingAnswers = (currentAttempt.attempt?.answers || [])
                .filter((a: any) => a !== null && a !== undefined)
                .map((a: any) => ({
                  questionId: a.questionId,
                  answer: a.answer,
                }));
              startIndex = currentAttempt.firstUnansweredIndex || 0;
            } else {
              // Fallback: if questionsShown is missing or empty, use questions from startAttempt
              console.warn(
                "[Widget] questionsShown missing or empty in current attempt, using questions from startAttempt"
              );
              if (attempt.questions && attempt.questions.length > 0) {
                questions = attempt.questions;
              } else {
                // Final fallback: fetch questions
                const quizData = await getQuestions(
                  this.config!.companyId,
                  jobId,
                  email
                );
                questions = quizData.questions;
              }
            }
          } else {
            // New attempt - use questions from startAttempt
            if (attempt.questions && attempt.questions.length > 0) {
              questions = attempt.questions;
            } else {
              // Fallback: if questions not returned, fetch them
              console.warn(
                "[Widget] Questions not returned from startAttempt, fetching from API"
              );
              const quizData = await getQuestions(
                this.config!.companyId,
                jobId,
                email
              );
              questions = quizData.questions;
            }
          }

          if (!Array.isArray(questions) || questions.length === 0) {
            alert("No questions available");
            document.body.removeChild(modal);
            return;
          }

          // Show quiz step
          showQuizStep(
            modalContent,
            questions,
            actualPassThreshold,
            attempt.sessionToken,
            attempt.attemptId,
            startIndex,
            existingAnswers,
            (result) => {
              // Quiz completed - call modal's onClose with result
              if (modalOnClose) {
                modalOnClose(result);
              }
            },
            undefined, // onProgress
            this.widgetStyles || undefined,
            this.config?.testMode
          );
        } catch (error: any) {
          console.error("Error in inline modal:", error);
          alert(`Error: ${error.message || "Failed to start verification"}`);
          document.body.removeChild(modal);
        }
      },
      this.widgetStyles || undefined
    );
  }

  /**
   * Attach widget to an element (gate mode)
   */
  private async attachToElement(element: HTMLElement, jobId: string) {
    // First validate that widget can render for this job
    const validation = await this.validateJob(jobId);
    if (!validation.canRender) {
      // Widget cannot render - don't intercept, let element work normally
      // Remove any existing handler if present
      const existingHandler = this.gateElements.get(element);
      if (existingHandler) {
        element.removeEventListener("click", existingHandler);
        this.gateElements.delete(element);
      }
      return;
    }

    // Remove existing click handler if present (to prevent duplicates)
    const existingHandler = this.gateElements.get(element);
    if (existingHandler) {
      element.removeEventListener("click", existingHandler);
      this.gateElements.delete(element);
    }

    // Get redirect URL
    let redirectUrl: string | undefined;
    if (element instanceof HTMLAnchorElement) {
      redirectUrl = element.href;
    } else {
      redirectUrl = element.getAttribute("data-reqcheck-redirect") || undefined;
    }

    // Create click handler
    const clickHandler = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      await this.showGateModal(jobId, redirectUrl);
    };

    // Intercept click
    element.addEventListener("click", clickHandler);
    this.gateElements.set(element, clickHandler);
  }

  /**
   * Verify candidate (public API method - for programmatic use)
   * Can be used for protect mode (with form) or gate mode (with redirect)
   */
  async verify(
    email: string | null,
    jobId: string,
    redirectUrl?: string
  ): Promise<void> {
    if (!this.config) {
      throw new Error("Widget not initialized");
    }

    // If email provided and redirectUrl provided, use gate mode flow
    if (email && redirectUrl) {
      await this.showGateModal(jobId, redirectUrl);
      return;
    }

    // Otherwise, this is likely called from email detection for protect mode
    // Find the form associated with this job
    const forms = document.querySelectorAll<HTMLFormElement>(
      `form[data-reqcheck-mode="protect"][data-reqcheck-job="${jobId}"]`
    );
    if (forms.length > 0) {
      await this.showProtectModal(forms[0], jobId);
    }
  }

  /**
   * Show gate mode modal (email → quiz) - same flow as Protect but without overlay
   */
  private async showGateModal(jobId: string, redirectUrl?: string) {
    if (!this.config) return;

    // Create modal with callback reference
    let storedEmail = "";
    let modalOnClose: ((result: ModalResult | null) => void) | null = null;

    const handleModalClose = (result: ModalResult | null) => {
      document.body.removeChild(modal);

      if (result) {
        if (result.passed) {
          // Store result
          if (storedEmail) {
            storeStatus(
              this.config!.companyId,
              jobId,
              storedEmail.toLowerCase(),
              true,
              result.score
            );
          }

          this.callbacks.onSuccess?.(result);

          // Redirect on pass
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          // Failed - store result and don't redirect
          if (storedEmail) {
            storeStatus(
              this.config!.companyId,
              jobId,
              storedEmail.toLowerCase(),
              false,
              result.score
            );
          }

          this.callbacks.onFailure?.(result);
        }
        this.callbacks.onComplete?.(result);
      }
    };

    const modal = createModal(handleModalClose, this.widgetStyles || undefined);
    modalOnClose = handleModalClose;

    document.body.appendChild(modal);
    const modalContent = modal.querySelector(
      ".reqcheck-modal-content"
    ) as HTMLElement;

    // Show email step
    showEmailStep(
      modalContent,
      async (email) => {
        storedEmail = email; // Store email for use in modal close callback
        storeEmail(this.config!.companyId, jobId, email); // Store in localStorage

        try {
          // Check for existing attempt
          const currentAttempt = await getCurrentAttempt(
            this.config!.companyId,
            jobId,
            email
          );

          if (currentAttempt.status === "passed") {
            // Already passed in last 24h - redirect immediately
            document.body.removeChild(modal);

            // Store status
            storeStatus(
              this.config!.companyId,
              jobId,
              email.toLowerCase(),
              true,
              currentAttempt.attempt?.score || 0
            );

            this.callbacks.onSuccess?.({
              passed: true,
              score: currentAttempt.attempt?.score || 0,
            });

            if (redirectUrl) {
              window.location.href = redirectUrl;
            }
            return;
          }

          if (
            currentAttempt.status === "failed" ||
            currentAttempt.status === "abandoned"
          ) {
            // Show failure message with 24h cooldown - END (don't redirect)
            modalContent.innerHTML = "";
            const container = document.createElement("div");
            container.style.cssText = "padding: 3rem 2rem; text-align: center;";

            const title = document.createElement("h2");
            title.textContent = "Verification Failed";
            title.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 1.75rem;
            font-weight: 600;
            color: #dc2626;
          `;

            const message = document.createElement("p");
            const hoursRemaining = currentAttempt.timeRemaining;
            message.textContent = hoursRemaining
              ? `You can try again in ${hoursRemaining} hour${hoursRemaining !== 1 ? "s" : ""}.`
              : "You can try again in 24 hours.";
            message.style.cssText = `
            margin: 0 0 2rem 0;
            color: #6b7280;
            font-size: 1rem;
          `;

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "Close";
            closeBtn.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: #000000;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
          `;
            closeBtn.onclick = () => {
              document.body.removeChild(modal);
            };

            container.appendChild(title);
            container.appendChild(message);
            container.appendChild(closeBtn);
            modalContent.appendChild(container);

            this.callbacks.onFailure?.({
              passed: false,
              score: currentAttempt.attempt?.score || 0,
            });
            return;
          }

          // Get pass threshold from validation
          const validation = await validateWidget(
            this.config!.companyId,
            jobId,
            this.config?.testMode
          );
          const actualPassThreshold = validation.config?.passThreshold || 70;

          // Start or resume attempt
          const attempt = await startAttempt(
            this.config!.companyId,
            jobId,
            email,
            this.config?.testMode
          );

          // Get questions (from attempt if resumed, or from startAttempt response for new attempts)
          let questions: QuizQuestion[] = [];
          let startIndex = 0;
          let existingAnswers: Array<{
            questionId: string;
            answer: string | string[];
          }> = [];

          if (attempt.resumed && currentAttempt.status === "in_progress") {
            // Resume from existing attempt
            // Ensure questionsShown is a valid array with length > 0
            const questionsShownFromAttempt =
              currentAttempt.attempt?.questionsShown;
            if (
              Array.isArray(questionsShownFromAttempt) &&
              questionsShownFromAttempt.length > 0
            ) {
              questions = questionsShownFromAttempt;
              // Answers are stored in order matching questionsShown (may contain nulls for unanswered)
              existingAnswers = (currentAttempt.attempt?.answers || [])
                .filter((a: any) => a !== null && a !== undefined)
                .map((a: any) => ({
                  questionId: a.questionId,
                  answer: a.answer,
                }));
              startIndex = currentAttempt.firstUnansweredIndex || 0;
            } else {
              // Fallback: if questionsShown is missing or empty, use questions from startAttempt
              console.warn(
                "[Widget] questionsShown missing or empty in current attempt, using questions from startAttempt"
              );
              if (attempt.questions && attempt.questions.length > 0) {
                questions = attempt.questions;
              } else {
                // Final fallback: fetch questions
                const quizData = await getQuestions(
                  this.config!.companyId,
                  jobId,
                  email
                );
                questions = quizData.questions;
              }
            }
          } else {
            // New attempt - use questions from startAttempt
            if (attempt.questions && attempt.questions.length > 0) {
              questions = attempt.questions;
            } else {
              // Fallback: if questions not returned, fetch them
              console.warn(
                "[Widget] Questions not returned from startAttempt, fetching from API"
              );
              const quizData = await getQuestions(
                this.config!.companyId,
                jobId,
                email
              );
              questions = quizData.questions;
            }
          }

          if (!Array.isArray(questions) || questions.length === 0) {
            alert("No questions available");
            document.body.removeChild(modal);
            return;
          }

          // Show quiz step
          showQuizStep(
            modalContent,
            questions,
            actualPassThreshold,
            attempt.sessionToken,
            attempt.attemptId,
            startIndex,
            existingAnswers,
            (result) => {
              // Quiz completed - call modal's onClose with result
              if (modalOnClose) {
                modalOnClose(result);
              }
            },
            undefined, // onProgress
            this.widgetStyles || undefined,
            this.config?.testMode
          );
        } catch (error: any) {
          console.error("Error in gate modal:", error);
          alert(`Error: ${error.message || "Failed to start verification"}`);
          document.body.removeChild(modal);
        }
      },
      this.widgetStyles || undefined
    );
  }

  /**
   * Show quiz modal and collect answers
   */
  private async showQuizModal(
    questions: QuizQuestion[],
    passThreshold: number,
    sessionToken: string,
    attemptId: string
  ): Promise<{ passed: boolean; score: number }> {
    return new Promise((resolve) => {
      // Create modal
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      const content = document.createElement("div");
      content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
      `;

      let currentQuestionIndex = 0;
      const answers: Array<{
        questionId: string;
        question: QuizQuestion;
        answer: string | string[];
      }> = [];

      const startTime = Date.now();

      const renderQuestion = () => {
        content.innerHTML = "";

        const question = questions[currentQuestionIndex];
        const questionNum = currentQuestionIndex + 1;
        const totalQuestions = questions.length;

        // Question header
        const header = document.createElement("div");
        header.innerHTML = `
          <h2 style="margin: 0 0 1rem 0;">Question ${questionNum} of ${totalQuestions}</h2>
          <p style="margin: 0 0 1.5rem 0;">${question.prompt}</p>
        `;
        content.appendChild(header);

        // Question content
        const questionDiv = document.createElement("div");
        questionDiv.style.marginBottom = "1.5rem";

        if (question.type === "multiple_choice") {
          const options = question.config.options || [];
          options.forEach((option: string) => {
            const label = document.createElement("label");
            label.style.cssText = `
              display: block;
              padding: 0.75rem;
              margin: 0.5rem 0;
              border: 1px solid #ddd;
              border-radius: 4px;
              cursor: pointer;
            `;

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `question-${question.id}`;
            radio.value = option;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${option}`));

            questionDiv.appendChild(label);
          });
        } else if (question.type === "fill_blank_blocks") {
          // Simplified fill blank - in production, use a proper editor
          const input = document.createElement("textarea");
          input.placeholder = "Enter your answer...";
          input.style.cssText = `
            width: 100%;
            min-height: 100px;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          `;
          questionDiv.appendChild(input);
        }

        content.appendChild(questionDiv);

        // Navigation buttons
        const navDiv = document.createElement("div");
        navDiv.style.cssText = `
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
        `;

        if (currentQuestionIndex > 0) {
          const prevBtn = document.createElement("button");
          prevBtn.textContent = "Previous";
          prevBtn.onclick = () => {
            currentQuestionIndex--;
            renderQuestion();
          };
          navDiv.appendChild(prevBtn);
        } else {
          navDiv.appendChild(document.createElement("div")); // Spacer
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent =
          currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
        nextBtn.onclick = () => {
          // Get answer
          let answer: string | string[] = "";

          if (question.type === "multiple_choice") {
            const selected = document.querySelector<HTMLInputElement>(
              `input[name="question-${question.id}"]:checked`
            );
            answer = selected?.value || "";
          } else if (question.type === "fill_blank_blocks") {
            const input =
              questionDiv.querySelector<HTMLTextAreaElement>("textarea");
            answer = input?.value || "";
          }

          if (!answer) {
            alert("Please provide an answer");
            return;
          }

          answers.push({
            questionId: question.id,
            question,
            answer,
          });

          if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
          } else {
            // Submit
            submitAttempt(
              sessionToken,
              attemptId,
              answers,
              Math.floor((Date.now() - startTime) / 1000)
            )
              .then((result) => {
                document.body.removeChild(modal);
                resolve({
                  passed: result.passed,
                  score: result.score,
                });
              })
              .catch((error) => {
                alert(`Error submitting: ${error.message}`);
              });
          }
        };
        navDiv.appendChild(nextBtn);

        content.appendChild(navDiv);
      };

      renderQuestion();

      modal.appendChild(content);
      document.body.appendChild(modal);
    });
  }

  /**
   * Initialize a specific element
   */
  async initElement(element: HTMLElement, jobId?: string) {
    if (!this.config) {
      throw new Error("Widget not initialized");
    }

    const mode = element.getAttribute("data-reqcheck-mode");
    const elementJobId =
      jobId || element.getAttribute("data-reqcheck-job") || this.config.jobId;

    if (!elementJobId) {
      console.warn("ReqCheck: No jobId provided for element initialization");
      return;
    }

    if (mode === "protect" && element instanceof HTMLFormElement) {
      await this.attachToForm(element, elementJobId);
    } else if (mode === "gate") {
      await this.attachToElement(element, elementJobId);
    } else if (mode === "inline") {
      await this.attachToInlineElement(element, elementJobId);
    }
  }
}

// Create global instance
const widget = new ReqCheckWidget();

// Auto-initialize from script tag attributes
if (typeof window !== "undefined") {
  const script = document.currentScript as HTMLScriptElement | null;
  if (script) {
    const companyId = script.getAttribute("data-reqcheck-company");
    const autoInit = script.getAttribute("data-reqcheck-auto-init") !== "false";
    const testMode = script.getAttribute("data-reqcheck-test-mode") === "true";

    if (companyId) {
      widget.init(
        {
          companyId,
          jobId: "", // Will be set per element
          autoInit,
          testMode,
        },
        {}
      );
    }
  }
}

// Export global API
declare global {
  interface Window {
    ReqCheck: {
      init: typeof widget.init;
      verify: typeof widget.verify;
      initElement: typeof widget.initElement;
    };
  }
}

window.ReqCheck = {
  init: widget.init.bind(widget),
  verify: widget.verify.bind(widget),
  initElement: widget.initElement.bind(widget),
};

export default widget;
