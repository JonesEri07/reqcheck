/**
 * Overlay component for Protect Mode
 * Creates a semi-transparent overlay that blocks access to form elements
 */

import type { WidgetStyles } from "./api";

export function createOverlay(
  onCTAClick: () => void,
  showProgress?: boolean,
  styles?: WidgetStyles
): HTMLElement {
  const getStyle = (key: keyof WidgetStyles, defaultValue: string) =>
    styles?.[key] || defaultValue;
  const overlay = document.createElement("div");
  overlay.className = "reqcheck-overlay";
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    border-radius: inherit;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  `;

  const title = document.createElement("h3");
  title.textContent = "Verification Required";
  title.style.cssText = `
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${getStyle("fontColor", "#1f2937")};
  `;

  const description = document.createElement("p");
  description.textContent = showProgress
    ? "Continue your verification to unlock this form."
    : "Complete reqCHECK verification to unlock this form.";
  description.style.cssText = `
    margin: 0 0 1.5rem 0;
    color: ${getStyle("fontColor", "#6b7280")};
    opacity: 0.8;
    font-size: 0.875rem;
  `;

  const button = document.createElement("button");
  button.textContent = showProgress
    ? "Continue Verification"
    : "Start Verification";
  const buttonColor = getStyle("buttonColor", "#000000");
  const buttonTextColor = getStyle("buttonTextColor", "white");
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
    onCTAClick();
  };

  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(button);
  overlay.appendChild(content);

  return overlay;
}

export function removeOverlay(element: HTMLElement): void {
  const overlay = element.querySelector(".reqcheck-overlay");
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Update overlay to show failed result
 */
export function updateOverlayToFailed(
  element: HTMLElement,
  score: number,
  passThreshold: number,
  timeRemaining: number | null,
  styles?: WidgetStyles
): void {
  const overlay = element.querySelector<HTMLElement>(".reqcheck-overlay");
  if (!overlay) return;

  const getStyle = (key: keyof WidgetStyles, defaultValue: string) =>
    styles?.[key] || defaultValue;

  const content = overlay.querySelector("div") as HTMLElement;
  if (!content) return;

  // Update content to show failed result
  content.innerHTML = "";

  // Failed icon
  const icon = document.createElement("div");
  icon.style.cssText = `
    font-size: 3rem;
    margin-bottom: 1rem;
  `;
  icon.textContent = "✗";
  content.appendChild(icon);

  // Failed title
  const title = document.createElement("h3");
  title.textContent = "Verification Failed";
  title.style.cssText = `
    margin: 0 0 0.75rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #dc2626;
  `;
  content.appendChild(title);

  // Score information
  const scoreText = document.createElement("p");
  scoreText.textContent = `Score: ${score}% (Required: ${passThreshold}%)`;
  scoreText.style.cssText = `
    margin: 0 0 0.5rem 0;
    color: ${getStyle("fontColor", "#6b7280")};
    opacity: 0.8;
    font-size: 0.875rem;
  `;
  content.appendChild(scoreText);

  // Time remaining message
  if (timeRemaining !== null && timeRemaining > 0) {
    const timeText = document.createElement("p");
    timeText.textContent = `You can try again in ${timeRemaining} hour${timeRemaining !== 1 ? "s" : ""}.`;
    timeText.style.cssText = `
      margin: 0;
      color: ${getStyle("fontColor", "#6b7280")};
      opacity: 0.7;
      font-size: 0.875rem;
    `;
    content.appendChild(timeText);
  } else {
    const timeText = document.createElement("p");
    timeText.textContent = "You can try again in 24 hours.";
    timeText.style.cssText = `
      margin: 0;
      color: ${getStyle("fontColor", "#6b7280")};
      opacity: 0.7;
      font-size: 0.875rem;
    `;
    content.appendChild(timeText);
  }
}
