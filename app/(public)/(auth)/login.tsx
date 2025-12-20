"use client";

import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import { CircleIcon, Loader2, Mail } from "lucide-react";
import { signIn, sendOTP, verifyOTP } from "./actions";
import { ActionState } from "@/lib/auth/proxy";
import { useToastAction } from "@/lib/utils/use-toast-action";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const plan = searchParams.get("plan"); // New: plan query param (free, pro-monthly, pro-annual)

  // State for OTP flow (sign-up only)
  const [otpStep, setOtpStep] = useState<"email" | "otp">("email");
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [otpValue, setOtpValue] = useState<string>("");

  const [signInState, signInAction, isSignInPending] = useActionState<
    ActionState,
    FormData
  >(signIn, { error: "" });

  const [sendOTPState, sendOTPAction, isSendOTPPending] = useActionState<
    ActionState,
    FormData
  >(sendOTP, { error: "" });

  const [verifyOTPState, verifyOTPAction, isVerifyOTPPending] = useActionState<
    ActionState,
    FormData
  >(verifyOTP, { error: "" });

  // Automatically show toasts for action results
  useToastAction(signInState);
  useToastAction(sendOTPState);
  useToastAction(verifyOTPState);

  // Move to OTP step when OTP is sent successfully
  useEffect(() => {
    if (sendOTPState.success && sendOTPState.email) {
      setVerifiedEmail(sendOTPState.email);
      setOtpStep("otp");
    }
  }, [sendOTPState]);

  // Determine plan display info
  const getPlanInfo = () => {
    switch (plan) {
      case "free":
        return { name: "Free", price: "$0/month" };
      case "pro-monthly":
        return { name: "Pro Monthly", price: "$99/month" };
      case "pro-annual":
        return { name: "Pro Annual", price: "$990/year" };
      default:
        return null;
    }
  };

  const planInfo = getPlanInfo();

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          {mode === "signin"
            ? "Sign in to your account"
            : "Create your account"}
        </h2>
        {mode === "signup" && planInfo && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            You're signing up for:{" "}
            <span className="font-semibold">{planInfo.name}</span> (
            {planInfo.price})
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {mode === "signin" ? (
          // Sign-in form (no OTP required)
          <form className="space-y-6" action={signInAction}>
            <input type="hidden" name="redirect" value={redirect || ""} />
            <input type="hidden" name="priceId" value={priceId || ""} />
            <input type="hidden" name="inviteId" value={inviteId || ""} />
            {inviteId && (
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  Sign in to accept your team invitation.
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={signInState.email}
                  required
                  maxLength={50}
                  className="rounded-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue={signInState.password}
                  required
                  minLength={8}
                  maxLength={100}
                  className="rounded-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isSignInPending}
              >
                {isSignInPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        ) : otpStep === "email" ? (
          // Step 1: Email, password, team name → Send OTP
          <form className="space-y-6" action={sendOTPAction}>
            <input type="hidden" name="plan" value={plan || ""} />
            <input type="hidden" name="inviteId" value={inviteId || ""} />
            {sendOTPState?.redirectToSignIn && sendOTPState?.inviteId && (
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  You already have an account.{" "}
                  <Link
                    href={`/sign-in?inviteId=${sendOTPState.inviteId}`}
                    className="font-medium underline"
                  >
                    Sign in to accept the invitation
                  </Link>
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={sendOTPState.email}
                  required
                  maxLength={50}
                  className="rounded-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  defaultValue={sendOTPState.password}
                  required
                  minLength={8}
                  maxLength={100}
                  className="rounded-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!inviteId && (
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <div className="mt-1">
                  <Input
                    id="teamName"
                    name="teamName"
                    type="text"
                    autoComplete="organization"
                    defaultValue={sendOTPState.teamName}
                    required
                    minLength={1}
                    maxLength={100}
                    className="rounded-full"
                    placeholder="Enter your team name"
                  />
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isSendOTPPending}
              >
                {isSendOTPPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          // Step 2: OTP Verification
          <form className="space-y-6" action={verifyOTPAction}>
            <Card className="mb-4 bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground">
                  <Mail className="inline h-4 w-4 mr-1" />
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-semibold">{verifiedEmail}</span>
                </p>
              </CardContent>
            </Card>

            <div>
              <Label className="mb-2">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <input type="hidden" name="email" value={verifiedEmail} />
            <input type="hidden" name="otp" value={otpValue} />

            <div>
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isVerifyOTPPending || otpValue.length !== 6}
              >
                {isVerifyOTPPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setOtpStep("email");
                  setVerifiedEmail("");
                  setOtpValue("");
                }}
                className="text-sm text-primary hover:text-primary/80"
              >
                Change email address
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                {mode === "signin"
                  ? "New to our platform?"
                  : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link
                href={`${mode === "signin" ? "/pricing" : "/sign-in"}${
                  redirect ? `?redirect=${redirect}` : ""
                }${priceId ? `&priceId=${priceId}` : ""}`}
              >
                {mode === "signin"
                  ? "Create an account"
                  : "Sign in to existing account"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
