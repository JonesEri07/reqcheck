import { z } from "zod";
import { TeamDataWithMembers, User } from "@/lib/db/schema";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export type ActionState = {
  error?: string; // Server/action errors (not validation)
  success?: string;
  fieldErrors?: Record<string, string>; // Field-level validation errors
  [key: string]: any; // This allows for additional properties
};

/**
 * Convert Zod error messages to user-friendly messages
 */
function makeErrorMessageFriendly(message: string, path: string): string {
  // Transform common Zod error messages to user-friendly ones
  if (message.includes("Array must contain at least")) {
    const match = message.match(/at least (\d+) element/);
    const min = match ? match[1] : "2";
    if (path.includes("options")) {
      return `Please provide at least ${min} answer options`;
    } else {
      return `Please provide at least ${min} items`;
    }
  } else if (
    message.includes("Required") ||
    message.includes("String must contain at least 1 character")
  ) {
    if (path.includes("correctAnswer")) {
      return "Please select a correct answer";
    }
    return "This field is required";
  } else if (message.includes("Invalid uuid")) {
    return "Invalid selection";
  } else if (message.includes("String must contain at least")) {
    const match = message.match(/at least (\d+) character/);
    const min = match ? match[1] : "1";
    return `Must be at least ${min} character${min !== "1" ? "s" : ""}`;
  } else if (message.includes("Invalid enum value")) {
    return "Invalid selection";
  } else if (message.includes("Expected number")) {
    return "Must be a valid number";
  } else if (message.includes("Invalid config")) {
    return "Invalid question configuration";
  } else if (
    message.includes("Invalid config format") ||
    message.includes("Invalid config JSON")
  ) {
    return "Invalid question configuration format";
  }

  return message;
}

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      // Convert Zod errors to field-level errors
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.length > 0 ? err.path.join(".") : "root";
        // If path is empty, use the error code or message as fallback
        const fieldName =
          path === "root" ? (err.code === "custom" ? "form" : "unknown") : path;
        fieldErrors[fieldName] = makeErrorMessageFriendly(err.message, path);
      });
      return { fieldErrors };
    }

    return action(result.data, formData);
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: User
) => Promise<T>;

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const user = await getUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      // Convert Zod errors to field-level errors
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.length > 0 ? err.path.join(".") : "root";
        // If path is empty, use the error code or message as fallback
        const fieldName =
          path === "root" ? (err.code === "custom" ? "form" : "unknown") : path;
        fieldErrors[fieldName] = makeErrorMessageFriendly(err.message, path);
      });
      return { fieldErrors };
    }

    return action(result.data, formData, user);
  };
}

type ActionWithTeamFunction<T> = (
  formData: FormData,
  team: TeamDataWithMembers
) => Promise<T>;

export function withTeam<T>(action: ActionWithTeamFunction<T>) {
  return async (formData: FormData): Promise<T> => {
    const user = await getUser();
    if (!user) {
      redirect("/sign-in");
    }

    const team = await getTeamForUser();
    if (!team) {
      throw new Error("Team not found");
    }

    return action(formData, team);
  };
}
