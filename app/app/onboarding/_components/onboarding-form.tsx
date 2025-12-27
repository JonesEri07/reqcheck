"use client";

import { useActionState, useTransition } from "react";
import { useState, useEffect } from "react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { ActionState } from "@/lib/auth/proxy";
import { completeOnboardingAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormErrors = {
  teamName?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
};

export function OnboardingForm({
  team,
  userEmail,
}: {
  team: { id: number };
  userEmail: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    completeOnboardingAction,
    {}
  );

  const [formData, setFormData] = useState({
    teamName: (state as any)?.teamName || "",
    userName: (state as any)?.userName || "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isTransitioning, startTransition] = useTransition();

  useToastAction(state);

  // Sync form data with state when it updates (e.g., from server errors)
  useEffect(() => {
    if ((state as any)?.teamName)
      setFormData((prev) => ({ ...prev, teamName: (state as any).teamName }));
    if ((state as any)?.userName)
      setFormData((prev) => ({ ...prev, userName: (state as any).userName }));
  }, [(state as any)?.teamName, (state as any)?.userName]);

  // Validate individual field
  const validateField = (
    name: string,
    value: string,
    passwordValue?: string
  ): string | undefined => {
    switch (name) {
      case "teamName":
        if (!value.trim()) return "Team name is required";
        if (value.length > 100)
          return "Team name must be 100 characters or less";
        return undefined;
      case "userName":
        if (!value.trim()) return "Your name is required";
        if (value.length > 100) return "Name must be 100 characters or less";
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return undefined;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        const passwordToCompare = passwordValue ?? formData.password;
        if (value !== passwordToCompare) return "Passwords do not match";
        return undefined;
      default:
        return undefined;
    }
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    return (
      formData.teamName.trim() !== "" &&
      formData.userName.trim() !== "" &&
      formData.password.length >= 8 &&
      formData.confirmPassword === formData.password &&
      formData.confirmPassword !== ""
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate field on blur
    // For confirmPassword, pass the current password value for comparison
    const passwordValue =
      name === "confirmPassword" ? formData.password : undefined;
    const error = validateField(name, value, passwordValue);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  // Re-validate confirmPassword when password changes
  useEffect(() => {
    if (touched.confirmPassword) {
      const passwordToCompare = formData.password;
      const error = validateField(
        "confirmPassword",
        formData.confirmPassword,
        passwordToCompare
      );
      if (error) {
        setErrors((prev) => ({ ...prev, confirmPassword: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({
      teamName: true,
      userName: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const newErrors: FormErrors = {};
    let isValid = true;

    const fields = [
      "teamName",
      "userName",
      "password",
      "confirmPassword",
    ] as const;
    fields.forEach((field) => {
      const passwordValue =
        field === "confirmPassword" ? formData.password : undefined;
      const error = validateField(field, formData[field], passwordValue);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      const form = e.currentTarget;
      const formDataObj = new FormData(form);
      // Set form values from state to ensure they're current
      formDataObj.set("teamName", formData.teamName);
      formDataObj.set("userName", formData.userName);
      formDataObj.set("password", formData.password);
      formDataObj.set("confirmPassword", formData.confirmPassword);
      startTransition(() => {
        formAction(formDataObj);
      });
    }
  };

  const showError = (field: keyof FormErrors): boolean => {
    return touched[field] === true && !!errors[field];
  };

  const isSubmitDisabled = pending || !isFormValid();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} onSubmit={handleSubmit}>
          <input type="hidden" name="teamId" value={team.id} />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userEmail}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                name="teamName"
                placeholder="Acme Inc."
                value={formData.teamName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={100}
                aria-invalid={showError("teamName")}
                className={showError("teamName") ? "border-destructive" : ""}
              />
              {showError("teamName") && (
                <p className="text-sm text-destructive">{errors.teamName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                name="userName"
                placeholder="John Doe"
                value={formData.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={100}
                aria-invalid={showError("userName")}
                className={showError("userName") ? "border-destructive" : ""}
              />
              {showError("userName") && (
                <p className="text-sm text-destructive">{errors.userName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={showError("password")}
                className={showError("password") ? "border-destructive" : ""}
              />
              {showError("password") ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={showError("confirmPassword")}
                className={
                  showError("confirmPassword") ? "border-destructive" : ""
                }
              />
              {showError("confirmPassword") && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
              {state &&
                "fieldErrors" in state &&
                state.fieldErrors?.confirmPassword &&
                !showError("confirmPassword") && (
                  <p className="text-sm text-destructive">
                    {state.fieldErrors.confirmPassword}
                  </p>
                )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitDisabled}
            >
              {pending ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
