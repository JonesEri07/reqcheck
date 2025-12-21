"use client";

import { Bot, FileText } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export function ProblemSection() {
  // Calculate maxDistanceY based on screen width
  const [maxDistanceY, setMaxDistanceY] = useState(190);

  useEffect(() => {
    // Calculate based on screen width - use a ratio that maintains good proportions
    // Animation container is max-w-[500px], so we scale Y distance with screen width
    const calculateMaxDistanceY = () => {
      if (typeof window !== "undefined") {
        const screenWidth = window.innerWidth;
        // Scale Y distance proportionally to screen width, with a reasonable ratio
        // Base: 190px at ~500px width, scale proportionally
        const baseWidth = 500;
        const baseDistanceY = 190;
        const ratio = Math.min(screenWidth / baseWidth, 1.2); // Cap at 1.2x for very wide screens
        setMaxDistanceY(baseDistanceY * ratio);
      }
    };

    calculateMaxDistanceY();
    window.addEventListener("resize", calculateMaxDistanceY);
    return () => window.removeEventListener("resize", calculateMaxDistanceY);
  }, []);

  // Rectangular bounds: use full available width, height scales with screen width
  // Animation area is fixed at max-w-[500px] and h-[400px]
  const maxDistanceX = 240; // Nearly full width (500px / 2 = 250px, with small padding)

  // Generate random branches with random directions and distances within rectangular bounds
  // Using deterministic pseudo-random based on index for consistency across renders
  // Recalculate when maxDistanceY changes
  const branches = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        // Random angle (0 to 2π) using pseudo-random based on index
        const angleSeed = (i * 137.508) % 360; // Golden angle approximation for good distribution
        const angle = (angleSeed * Math.PI) / 180;

        // Random distance within rectangular bounds
        // Use different pseudo-random for distance
        const distanceSeed = ((i * 97) % 100) / 100; // 0-1

        // Calculate max distance in this direction (to stay within rectangular bounds)
        // For a rectangle, we need to find the intersection with the boundary
        const cosAngle = Math.abs(Math.cos(angle));
        const sinAngle = Math.abs(Math.sin(angle));

        // Calculate which boundary we hit first (horizontal or vertical)
        const distToXBoundary =
          cosAngle > 0 ? maxDistanceX / cosAngle : Infinity;
        const distToYBoundary =
          sinAngle > 0 ? maxDistanceY / sinAngle : Infinity;
        const maxDist = Math.min(distToXBoundary, distToYBoundary);

        // Random distance between 60px and max distance
        const minDist = 60;
        const distance = minDist + (maxDist - minDist) * distanceSeed;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        // Staggered animation delays for continuous effect
        const delay = (i * 0.3) % 2.5; // Spread over 2.5s cycle
        const bubbleDelay = delay + 1.0; // Bubble spawns when line finishes (40% of 2.5s = 1s)

        return { x, y, angle, distance, delay, bubbleDelay };
      }),
    [maxDistanceY]
  );

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Section Header */}
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-12">
            AI Bots Are Flooding Your Inbox
          </h2>

          {/* Robot Icon with Animation Space */}
          <div className="relative inline-flex items-center justify-center my-16 w-full max-w-[500px] h-[400px]">
            {/* Animated web visual - positioned behind robot icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                width="500"
                height="400"
                viewBox="0 0 500 400"
                className="absolute"
                preserveAspectRatio="none"
              >
                {/* Animated lines shooting from edge of robot icon bubble */}
                {branches.map((branch, i) => {
                  // Convert from center-relative coordinates to SVG coordinates
                  const centerX = 250;
                  const centerY = 200;
                  // Robot icon bubble is w-16 h-16 (64px), so radius is 32px
                  const robotBubbleRadius = 32;
                  // Calculate starting point on the edge of the bubble in the direction of the target
                  const startX =
                    centerX + Math.cos(branch.angle) * robotBubbleRadius;
                  const startY =
                    centerY + Math.sin(branch.angle) * robotBubbleRadius;
                  const endX = centerX + branch.x;
                  const endY = centerY + branch.y;
                  return (
                    <line
                      key={`line-${i}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-destructive/50 animate-draw-line"
                      style={{
                        animationDelay: `${branch.delay}s`,
                      }}
                    />
                  );
                })}
                {/* Document bubbles that spawn at end of lines */}
                {branches.map((branch, i) => {
                  const centerX = 250;
                  const centerY = 200;
                  const endX = centerX + branch.x;
                  const endY = centerY + branch.y;
                  return (
                    <g
                      key={`bubble-${i}`}
                      transform={`translate(${endX}, ${endY})`}
                      className="animate-spawn-bubble"
                      style={{
                        animationDelay: `${branch.bubbleDelay}s`,
                      }}
                    ></g>
                  );
                })}
              </svg>
            </div>

            {/* Document icons that spawn at end of lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {branches.map((branch, i) => {
                // Use exact same coordinates as SVG for perfect alignment
                const centerX = 250;
                const centerY = 200;
                const endX = centerX + branch.x;
                const endY = centerY + branch.y;
                // Convert SVG coordinates (0-500, 0-400) to percentage of container
                // Container is 500px × 400px
                const leftPercent = (endX / 500) * 98;
                const topPercent = (endY / 400) * 98;
                return (
                  <div
                    key={`doc-icon-${i}`}
                    className="absolute animate-spawn-bubble"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: "translate(-50%, -50%)",
                      animationDelay: `${branch.bubbleDelay}s`,
                    }}
                  >
                    <FileText className="text-destructive/60" size={18} />
                  </div>
                );
              })}
            </div>

            {/* Robot Icon - centered */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 relative z-10">
              <Bot className="h-8 w-8 text-destructive animate-pulse" />
            </div>
          </div>

          {/* Section Paragraph Text */}
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
