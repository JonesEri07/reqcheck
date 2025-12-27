"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { processCheckoutAction } from "./actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: "basic" | "pro-monthly";
  planName: string;
}

export function CheckoutEmailModal({
  open,
  onOpenChange,
  planType,
  planName,
}: CheckoutEmailModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(
    processCheckoutAction,
    null
  );

  // Handle redirects and toast messages
  useEffect(() => {
    if (state?.redirectTo) {
      const redirectTo = state.redirectTo;
      // Show toast message explaining why redirecting to sign-in
      toast.info(
        "An account with this email already exists. Please sign in to continue.",
        {
          duration: 3000,
        }
      );
      // Small delay to show toast before redirect
      setTimeout(() => {
        router.push(redirectTo);
        onOpenChange(false);
        setEmail("");
      }, 500);
    }
  }, [state?.redirectTo, router, onOpenChange]);

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Started with {planName}</DialogTitle>
          <DialogDescription>
            Enter your email address to continue to checkout.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="planType" value={planType} />
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={pending}
              autoFocus
            />
          </div>
          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !email}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Checkout"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
