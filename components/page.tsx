import * as React from "react";
import { cn } from "@/lib/utils";

interface PageProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className, ...props }: PageProps) {
  return (
    <section
      className={cn("flex-1 p-4 lg:p-8 min-w-0 overflow-x-hidden", className)}
      {...props}
    >
      {children}
    </section>
  );
}
