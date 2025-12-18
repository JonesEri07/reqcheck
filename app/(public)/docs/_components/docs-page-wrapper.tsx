"use client";

import * as React from "react";
import { TableOfContents } from "@/app/(public)/docs/_components/docs-table-of-contents";

interface Heading {
  id: string;
  text: string;
  level: number;
  isSubsection?: boolean;
}

interface DocsPageWrapperProps {
  children: React.ReactNode;
}

export function DocsPageWrapper({ children }: DocsPageWrapperProps) {
  const [headings, setHeadings] = React.useState<Heading[]>([]);

  React.useEffect(() => {
    // Wait for content to be rendered
    const timer = setTimeout(() => {
      const extractedHeadings: Heading[] = [];

      // First, get h1 (main page title)
      const h1 = document.querySelector("h1[id]");
      if (h1 && h1.id) {
        const text = h1.textContent?.trim() || "";
        extractedHeadings.push({ id: h1.id, text, level: 1 });
      }

      // Get all elements with IDs that are likely Card components
      // Cards typically have IDs and contain CardTitle elements
      const elementsWithIds = Array.from(
        document.querySelectorAll("[id]")
      ).filter((el) => {
        // Skip the h1 we already processed
        if (el.tagName === "H1") return false;
        // Exclude Radix UI internal elements (tab triggers, tab content, etc.)
        if (el.id.startsWith("radix-")) return false;
        // Exclude elements with data-radix attributes (Radix UI components)
        if (
          el.hasAttribute("data-radix-tab-trigger") ||
          el.hasAttribute("data-radix-tab-content") ||
          el.hasAttribute("data-state")
        )
          return false;
        // Only include elements that are likely cards (have CardHeader or are in a space-y container)
        const hasCardStructure = el.querySelector(
          "[class*='CardHeader'], [class*='CardTitle']"
        );
        const isInContentArea = el.closest("div.space-y-8, div.space-y-6");
        return hasCardStructure || (isInContentArea && el.id);
      });

      elementsWithIds.forEach((element) => {
        const id = element.id;
        if (!id) return;

        // Try to find CardTitle - it's usually an h3 or has specific classes
        // But exclude Radix UI elements within the card
        const cardTitle = element.querySelector(
          "h3:not([id^='radix-']), [class*='CardTitle']:not([id^='radix-']), [class*='font-semibold']:not([id^='radix-'])"
        );
        const text =
          cardTitle?.textContent?.trim() ||
          element.getAttribute("aria-label") ||
          id.replace(/-/g, " ");

        // Skip if text looks like a Radix UI internal ID or is empty/meaningless
        if (!text || text.toLowerCase().includes("radix") || text.length < 2)
          return;

        if (id && text && !extractedHeadings.find((h) => h.id === id)) {
          extractedHeadings.push({ id, text, level: 2 });
        }
      });

      // Also get any h2, h3 headings that have IDs (but exclude Radix UI elements)
      const h2h3 = Array.from(
        document.querySelectorAll("h2[id], h3[id]")
      ).filter((el) => {
        return (
          !el.id.startsWith("radix-") &&
          !el.hasAttribute("data-radix-tab-trigger") &&
          !el.hasAttribute("data-radix-tab-content")
        );
      });

      h2h3.forEach((element) => {
        const id = element.id;
        const text = element.textContent?.trim() || "";
        const level = parseInt(element.tagName.charAt(1));

        if (id && text && !extractedHeadings.find((h) => h.id === id)) {
          extractedHeadings.push({ id, text, level });
        }
      });

      // Sort by position in DOM
      extractedHeadings.sort((a, b) => {
        const aEl = document.getElementById(a.id);
        const bEl = document.getElementById(b.id);
        if (!aEl || !bEl) return 0;
        const position = aEl.compareDocumentPosition(bEl);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

      // Mark subsections (IDs starting with '-')
      const processedHeadings = extractedHeadings.map((heading) => ({
        ...heading,
        isSubsection: heading.id.startsWith("-"),
      }));

      setHeadings(processedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="container mx-auto max-w-4xl px-4 py-16">{children}</div>
      </div>

      {/* Table of Contents - Hidden on mobile/tablet, shown on xl screens */}
      <TableOfContents headings={headings} />
    </div>
  );
}
