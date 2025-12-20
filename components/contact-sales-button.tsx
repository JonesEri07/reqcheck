import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContactSalesButtonProps {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  className?: string;
  children?: React.ReactNode;
}

export const CONTACT_SALES_URL =
  "https://cire-studios.moxieapp.com/public/reqcheck-enterprise";

/**
 * Reusable Contact Sales button component
 * Opens the enterprise contact form in a new tab
 */
export function ContactSalesButton({
  variant = "outline",
  className,
  children = "Contact Sales",
}: ContactSalesButtonProps) {
  return (
    <Button variant={variant} asChild className={cn(className)}>
      <a href={CONTACT_SALES_URL} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}
