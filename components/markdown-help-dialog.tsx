"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export function MarkdownHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Markdown formatting help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supported Markdown Formatting</DialogTitle>
          <DialogDescription>
            Use these markdown features to format your question prompt.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Code Blocks */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Code Blocks</h3>
            <p className="text-sm text-muted-foreground">
              Use triple backticks to create code blocks with optional language
              syntax highlighting:
            </p>
            <div className="rounded-lg border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre">
                <code>{`\`\`\`javascript
const x = 1;
console.log(x);
\`\`\``}</code>
              </pre>
            </div>
          </div>

          {/* Inline Code */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Inline Code</h3>
            <p className="text-sm text-muted-foreground">
              Use single backticks for inline code:
            </p>
            <div className="rounded-lg border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre">
                <code>{`Use the \`console.log()\` function to output values.`}</code>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Renders as: Use the{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                console.log()
              </code>{" "}
              function to output values.
            </p>
          </div>

          {/* Bold */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Bold Text</h3>
            <p className="text-sm text-muted-foreground">
              Use double asterisks or underscores:
            </p>
            <div className="rounded-lg border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre">
                <code>{`**Important:** This is bold text
__Also bold__`}</code>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Renders as: <strong>Important:</strong> This is bold text{" "}
              <strong>Also bold</strong>
            </p>
          </div>

          {/* Italic */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Italic Text</h3>
            <p className="text-sm text-muted-foreground">
              Use single asterisks or underscores:
            </p>
            <div className="rounded-lg border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre">
                <code>{`*This is italic*
_Also italic_`}</code>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Renders as: <em>This is italic</em> <em>Also italic</em>
            </p>
          </div>

          {/* Lists */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Lists</h3>
            <p className="text-sm text-muted-foreground">
              Create unordered lists with dashes or asterisks, or ordered lists
              with numbers:
            </p>
            <div className="rounded-lg border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre">
                <code>{`Unordered:
- First item
- Second item
- Third item

Ordered:
1. First step
2. Second step
3. Third step`}</code>
              </pre>
            </div>
          </div>

          {/* Line Breaks */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Line Breaks</h3>
            <p className="text-sm text-muted-foreground">
              Use blank lines to create paragraph breaks. Line breaks within
              paragraphs are preserved.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
