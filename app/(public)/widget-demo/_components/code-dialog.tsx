"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";
import type { WidgetStyles } from "./style-panel";

interface CodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "protect" | "gate" | "inline";
  companyId: string;
  jobId: string;
  styles: WidgetStyles;
}

export function CodeDialog({
  open,
  onOpenChange,
  mode,
  companyId,
  jobId,
  styles,
}: CodeDialogProps) {
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    // Default values
    const defaults: WidgetStyles = {
      primaryColor: "#000000",
      primaryTextColor: "#ffffff",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      secondaryTextColor: "#6b7280",
      borderColor: "#e5e7eb",
      successColor: "#059669",
      errorColor: "#dc2626",
      fontFamily: "",
      fontSize: "1rem",
      headingFontSize: "1.75rem",
      borderRadius: "8px",
      padding: "1rem",
      buttonPadding: "0.75rem 1.5rem",
      buttonBorderRadius: "6px",
      modalMaxWidth: "700px",
      modalBorderRadius: "12px",
    };

    // Build style attributes array
    const styleAttrs: string[] = [];
    const styleMap: Array<[keyof WidgetStyles, string]> = [
      ["primaryColor", "primary-color"],
      ["primaryTextColor", "primary-text-color"],
      ["backgroundColor", "background-color"],
      ["textColor", "text-color"],
      ["secondaryTextColor", "secondary-text-color"],
      ["borderColor", "border-color"],
      ["successColor", "success-color"],
      ["errorColor", "error-color"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["headingFontSize", "heading-font-size"],
      ["borderRadius", "border-radius"],
      ["padding", "padding"],
      ["buttonPadding", "button-padding"],
      ["buttonBorderRadius", "button-border-radius"],
      ["modalMaxWidth", "modal-max-width"],
      ["modalBorderRadius", "modal-border-radius"],
    ];

    for (const [key, attrName] of styleMap) {
      if (styles[key] !== defaults[key] && styles[key] !== "") {
        styleAttrs.push(`  data-reqcheck-style-${attrName}="${styles[key]}"`);
      }
    }

    const scriptAttrs =
      styleAttrs.length > 0
        ? `\n  data-reqcheck-company="${companyId}"\n${styleAttrs.join("\n")}`
        : `\n  data-reqcheck-company="${companyId}"`;

    if (mode === "protect") {
      return `<!-- Load widget script -->
<script
  src="https://reqcheck.io/widget.js"${scriptAttrs}
></script>

<!-- Form with protect mode -->
<form data-reqcheck-mode="protect" data-reqcheck-job="${jobId}">
  <input
    type="email"
    name="email"
    data-reqcheck-email-field="true"
    required
    placeholder="you@example.com"
  />
  <button type="submit">Submit Application</button>
</form>`;
    } else if (mode === "gate") {
      return `<!-- Load widget script -->
<script
  src="https://reqcheck.io/widget.js"${scriptAttrs}
></script>

<!-- Link or button with gate mode -->
<a
  href="https://jobs.example.com/apply/123"
  data-reqcheck-mode="gate"
  data-reqcheck-job="${jobId}"
>
  Apply Now
</a>`;
    } else {
      // inline
      return `<!-- Load widget script -->
<script
  src="https://reqcheck.io/widget.js"${scriptAttrs}
></script>

<!-- Inline widget container -->
<div data-reqcheck-mode="inline" data-reqcheck-job="${jobId}">
  <!-- Widget will render here -->
</div>`;
    }
  };

  const handleCopy = async () => {
    const code = generateCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Integration Code</DialogTitle>
          <DialogDescription>
            Copy this code to integrate the widget with your current style
            settings.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-[60vh]">
            <code className="text-xs">{generateCode()}</code>
          </pre>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="absolute top-4 right-4"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
