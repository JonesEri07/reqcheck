/**
 * Overlay component for Protect Mode
 * Creates a semi-transparent overlay that blocks access to form elements
 */

export function createOverlay(
  onCTAClick: () => void,
  showProgress?: boolean
): HTMLElement {
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
    z-index: 1000;
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
    color: #1f2937;
  `;

  const description = document.createElement("p");
  description.textContent = showProgress
    ? "Continue your verification to unlock this form."
    : "Complete reqCHECK verification to unlock this form.";
  description.style.cssText = `
    margin: 0 0 1.5rem 0;
    color: #6b7280;
    font-size: 0.875rem;
  `;

  const button = document.createElement("button");
  button.textContent = showProgress
    ? "Continue Verification"
    : "Start Verification";
  button.style.cssText = `
    padding: 0.75rem 1.5rem;
    background: #000000;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  button.onmouseenter = () => {
    button.style.background = "#1f2937";
  };
  button.onmouseleave = () => {
    button.style.background = "#000000";
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

