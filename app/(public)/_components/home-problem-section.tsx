"use client";

import { Bot, FileText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Size = { w: number; h: number };

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const cr = entry.contentRect;
      setSize({ w: Math.max(1, Math.floor(cr.width)), h: 400 });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const branches = useMemo(() => {
    if (size.w <= 1) return [];

    const centerX = size.w / 2;
    const centerY = size.h / 2;

    const robotBubbleRadius = 32;
    const padding = 16;

    const maxDistanceX = Math.max(60, centerX - robotBubbleRadius - padding);
    const maxDistanceY = Math.max(60, centerY - robotBubbleRadius - padding);

    // Tune these
    const iconOffset = 14; // how far beyond the line end the icon goes
    const bubbleOffset = 0; // set to same as iconOffset if you want bubble + icon together

    return Array.from({ length: 15 }, (_, i) => {
      const angleSeed = (i * 137.508) % 360;
      const angle = (angleSeed * Math.PI) / 180;

      const distanceSeed = ((i * 97) % 100) / 100;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const absCos = Math.abs(cosA);
      const absSin = Math.abs(sinA);

      const distToXBoundary = absCos > 0 ? maxDistanceX / absCos : Infinity;
      const distToYBoundary = absSin > 0 ? maxDistanceY / absSin : Infinity;
      const maxDist = Math.min(distToXBoundary, distToYBoundary);

      const minDist = 60;
      const distance = minDist + (maxDist - minDist) * distanceSeed;

      const endX = centerX + cosA * distance;
      const endY = centerY + sinA * distance;

      const startX = centerX + cosA * robotBubbleRadius;
      const startY = centerY + sinA * robotBubbleRadius;

      // New: shifted positions beyond line end
      const bubbleX = endX + cosA * bubbleOffset;
      const bubbleY = endY + sinA * bubbleOffset;

      const iconX = endX + cosA * iconOffset;
      const iconY = endY + sinA * iconOffset;

      const delay = (i * 0.3) % 2.5;
      const bubbleDelay = delay + 1.0;

      return {
        angle,
        cosA,
        sinA,
        delay,
        bubbleDelay,
        startX,
        startY,
        endX,
        endY,
        bubbleX,
        bubbleY,
        iconX,
        iconY,
      };
    });
  }, [size.w, size.h]);

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-12">
            AI Bots Are Flooding Your Inbox
          </h2>

          <div ref={containerRef} className="relative my-16 w-full h-[400px]">
            <div className="absolute inset-0 pointer-events-none">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${Math.max(size.w, 1)} ${size.h}`}
                preserveAspectRatio="none"
              >
                {branches.map((b, i) => (
                  <line
                    key={`line-${i}`}
                    x1={b.startX}
                    y1={b.startY}
                    x2={b.endX}
                    y2={b.endY}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-destructive/50 animate-draw-line"
                    style={{ animationDelay: `${b.delay}s` }}
                  />
                ))}

                {/* {branches.map((b, i) => (
                  <g
                    key={`bubble-${i}`}
                    transform={`translate(${b.bubbleX}, ${b.bubbleY})`}
                    className="animate-spawn-bubble"
                    style={{ animationDelay: `${b.bubbleDelay}s` }}
                  ></g>
                ))} */}
              </svg>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {branches.map((b, i) => (
                <div
                  key={`doc-icon-${i}`}
                  className="absolute animate-spawn-bubble bg-destructive/10 rounded-full p-2"
                  style={{
                    left: `${b.iconX - 16}px`,
                    top: `${b.iconY - 16}px`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${b.bubbleDelay}s`,
                  }}
                >
                  <FileText className="text-destructive/60" size={18} />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 relative z-10">
                <Bot className="h-8 w-8 text-destructive animate-pulse" />
              </div>
            </div>
          </div>

          <p className="mt-12 text-lg text-muted-foreground">
            Every job posting attracts hundreds of AI-generated resumes. You
            spend hours sifting through spam, fake credentials, and unqualified
            candidates. The signal-to-noise ratio is broken.
          </p>
        </div>
      </div>
    </section>
  );
}
