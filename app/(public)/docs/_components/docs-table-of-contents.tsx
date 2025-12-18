"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
  isSubsection?: boolean;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [dynamicHeadings, setDynamicHeadings] = React.useState<Heading[]>([]);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [indicatorPosition, setIndicatorPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const navRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});
  const rafRef = React.useRef<number | null>(null);

  // Separate root anchor (h1) from dynamic headings
  const rootAnchor = React.useMemo(
    () => headings.find((h) => h.level === 1),
    [headings]
  );

  React.useEffect(() => {
    // Get all headings except the root anchor
    const dynamic = headings.filter((h) => h.level !== 1);
    setDynamicHeadings(dynamic);

    // Trigger animation when dynamic headings are available
    if (dynamic.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [headings]);

  const updateActiveHeading = React.useCallback(() => {
    if (!headings.length) return;
    const offset = 160;
    let currentId: string | null = headings[0]?.id ?? null;

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (rect.top - offset <= 0) {
        currentId = heading.id;
      }
    }

    if (currentId && currentId !== activeId) {
      setActiveId(currentId);
    }
  }, [activeId, headings]);

  React.useEffect(() => {
    if (!headings.length) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateActiveHeading();
      });
    };

    updateActiveHeading();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [headings, updateActiveHeading]);

  const updateIndicatorPosition = React.useCallback(() => {
    if (!activeId) return;

    const nav = navRef.current;
    const activeAnchor = itemRefs.current[activeId];
    const icon = activeAnchor?.querySelector("[data-icon]");

    if (!nav || !activeAnchor || !(icon instanceof HTMLElement)) return;

    const navRect = nav.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();

    setIndicatorPosition({
      top: iconRect.top - navRect.top + iconRect.height / 2,
      left: iconRect.left - navRect.left + iconRect.width / 2,
    });
  }, [activeId]);

  React.useEffect(() => {
    updateIndicatorPosition();
  }, [
    updateIndicatorPosition,
    shouldAnimate,
    rootAnchor?.id,
    dynamicHeadings.length,
  ]);

  React.useEffect(() => {
    const handleResize = () => updateIndicatorPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicatorPosition]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
      setActiveId(id);

      // Update URL without scrolling
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const hasContent = rootAnchor || dynamicHeadings.length > 0;

  return (
    <aside
      className="hidden xl:block w-64 shrink-0"
      style={{ minWidth: "16rem", maxWidth: "16rem" }}
    >
      <div className="sticky top-14 self-start max-h-[calc(100vh-6rem)] overflow-auto py-6">
        {hasContent ? (
          <div className="space-y-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </h3>
            <nav ref={navRef} className="relative">
              <span
                className={cn(
                  "pointer-events-none absolute z-10 h-2.5 w-2.5 rounded-full bg-primary shadow-sm transition-[transform,opacity] duration-300 ease-out",
                  indicatorPosition ? "opacity-100" : "opacity-0"
                )}
                style={{
                  transform: indicatorPosition
                    ? `translate3d(${indicatorPosition.left}px, ${indicatorPosition.top}px, 0) translate(-50%, -50%)`
                    : "translate3d(0,0,0)",
                }}
              />
              <div className="space-y-1">
                {/* Root anchor - shown immediately */}
                {rootAnchor && (
                  <a
                    key={rootAnchor.id}
                    href={`#${rootAnchor.id}`}
                    onClick={(e) => handleClick(e, rootAnchor.id)}
                    className={cn(
                      "flex items-center gap-3 text-sm transition-colors text-muted-foreground hover:text-foreground truncate pl-0 font-medium",
                      activeId === rootAnchor.id && "text-foreground"
                    )}
                    title={rootAnchor.text}
                    ref={(el) => {
                      itemRefs.current[rootAnchor.id] = el;
                    }}
                  >
                    <span
                      data-icon
                      className={cn(
                        "relative flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-muted-foreground/60 bg-background transition-colors",
                        activeId === rootAnchor.id && "border-primary/70"
                      )}
                    >
                      {activeId === rootAnchor.id && (
                        <span className="absolute inset-0 -z-10 rounded-full bg-primary/90 animate-ping" />
                      )}
                      <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
                    </span>
                    <span className="truncate">{rootAnchor.text}</span>
                  </a>
                )}

                {/* Dynamic headings - animated with stagger */}
                {dynamicHeadings.map((heading, index) => {
                  const isSubsection =
                    heading.isSubsection ?? heading.id.startsWith("-");
                  const delay = index * 50; // 50ms stagger per item
                  const isActive = activeId === heading.id;

                  return (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={(e) => handleClick(e, heading.id)}
                      className={cn(
                        "flex items-center gap-3 text-sm transition-colors text-muted-foreground hover:text-foreground truncate",
                        heading.level === 2 && !isSubsection && "pl-4",
                        heading.level === 2 && isSubsection && "pl-8",
                        heading.level === 3 && !isSubsection && "pl-8",
                        heading.level === 3 && isSubsection && "pl-12",
                        isActive && "text-foreground"
                      )}
                      style={{
                        opacity: shouldAnimate ? 1 : 0,
                        transform: shouldAnimate
                          ? "translateY(0)"
                          : "translateY(-10px)",
                        transition: `opacity 0.4s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`,
                      }}
                      title={heading.text}
                      ref={(el) => {
                        itemRefs.current[heading.id] = el;
                      }}
                    >
                      <span
                        data-icon
                        className={cn(
                          "relative flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-muted-foreground/60 bg-background transition-colors",
                          isActive && "border-primary/70"
                        )}
                      >
                        {isActive && (
                          <span className="absolute inset-0 -z-10 rounded-full bg-primary/40 animate-ping" />
                        )}
                        <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
                      </span>
                      <span className="truncate">{heading.text}</span>
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>
        ) : (
          // Placeholder to reserve space and prevent layout shift
          <div className="space-y-2" style={{ minHeight: "1px" }}>
            <div className="mb-4 h-4 w-24 bg-transparent" />
          </div>
        )}
      </div>
    </aside>
  );
}
