"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Users } from "lucide-react";
import {
  acceptInviteForExistingUser,
  acceptInviteForNewUser,
} from "@/app/(public)/(auth)/actions";
import { ActionState } from "@/lib/auth/proxy";
import { useToastAction } from "@/lib/utils/use-toast-action";
import Link from "next/link";

interface Invitation {
  id: number;
  email: string;
  role: string;
  teamId: number;
  token: string;
}

interface AcceptInviteClientProps {
  invitation: Invitation;
  teamName: string;
}

export function AcceptInviteClient({
  invitation,
  teamName,
}: AcceptInviteClientProps) {
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  const [existingUserState, existingUserAction, isExistingUserPending] =
    useActionState<ActionState, FormData>(acceptInviteForExistingUser, {
      error: "",
    });

  const [newUserState, newUserAction, isNewUserPending] = useActionState<
    ActionState,
    FormData
  >(acceptInviteForNewUser, { error: "" });

  useToastAction(existingUserState);
  useToastAction(newUserState);

  // Check if user exists (we'll determine this from the email in the invitation)
  useEffect(() => {
    // We can't check server-side easily from client, so we'll show both forms
    // and let the server actions handle the validation
    setChecking(false);
    setUserExists(null); // We'll determine from server response
  }, []);

  // If existing user action returns error about user not found, show new user form
  useEffect(() => {
    if (
      existingUserState?.error?.includes("not found") ||
      existingUserState?.error?.includes("sign-up")
    ) {
      setUserExists(false);
    } else if (existingUserState?.error && !existingUserState.error.includes("password")) {
      // If there's an error but it's not about password, user might exist
      setUserExists(true);
    }
  }, [existingUserState]);

  // If new user action returns error about user existing, show existing user form
  useEffect(() => {
    if (newUserState?.error?.includes("already exists")) {
      setUserExists(true);
    }
  }, [newUserState]);

  const isLoading = isExistingUserPending || isNewUserPending;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Accept Invitation
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          You've been invited to join a team
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Team</p>
              <p className="font-medium">{teamName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{invitation.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{invitation.role}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          {userExists === false || (userExists === null && !checking) ? (
            // New user sign-up form (no OTP needed)
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" action={newUserAction}>
                  <input type="hidden" name="token" value={invitation.token} />
                  <input type="hidden" name="email" value={invitation.email} />

                  <div>
                    <Label htmlFor="new-password">Password</Label>
                    <div className="mt-1">
                      <Input
                        id="new-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={100}
                        className="rounded-full"
                        placeholder="Enter your password (min 8 characters)"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your email is already verified. Just create a password to
                      get started.
                    </p>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account & Accept Invitation"
                      )}
                    </Button>
                  </div>

                  {userExists === null && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setUserExists(true)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Already have an account? Sign in instead
                      </button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          ) : (
            // Existing user sign-in form
            <Card>
              <CardHeader>
                <CardTitle>Sign In to Accept</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" action={existingUserAction}>
                  <input type="hidden" name="token" value={invitation.token} />
                  <input type="hidden" name="email" value={invitation.email} />

                  <div>
                    <Label htmlFor="existing-password">Password</Label>
                    <div className="mt-1">
                      <Input
                        id="existing-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        minLength={8}
                        maxLength={100}
                        className="rounded-full"
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In & Accept Invitation"
                      )}
                    </Button>
                  </div>

                  {userExists === true && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setUserExists(false)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Don't have an account? Create one instead
                      </button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

