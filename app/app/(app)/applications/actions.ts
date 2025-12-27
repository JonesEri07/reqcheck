"use server";

import { validatedActionWithUser, type ActionState } from "@/lib/auth/proxy";
import { getTeamForUser } from "@/lib/db/queries";

// Note: Applications are now verificationAttempts with passed=true
// All passed attempts are automatically "verified" (they passed the quiz)
// This action is kept for backwards compatibility but does nothing
// TODO: Remove this action if not used in UI

// export const updateApplicationStatus = validatedActionWithUser(
//   { id: "" }, // Empty schema since we don't update anything
//   async (data, formData, user) => {
//     const team = await getTeamForUser();
//     if (!team) {
//       return { error: "Team not found" } as ActionState;
//     }

//     // Applications are automatically verified when they pass
//     // No manual verification needed
//     return {
//       success: "Application is already verified (passed verification)",
//     } as ActionState;
//   }
// );
