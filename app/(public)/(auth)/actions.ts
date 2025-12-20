"use server";

import { z } from "zod";
import { and, eq, sql, gt } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  User,
  users,
  teams,
  teamMembers,
  activityLogs,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  ActivityType,
  invitations,
  BillingPlan,
  emailVerifications,
  PlanName,
  notifications,
  NotificationType,
} from "@/lib/db/schema";
import { comparePasswords, hashPassword, setSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createCheckoutSession } from "@/lib/payments/stripe";
import {
  getUser,
  getUserWithTeam,
  getTeamForUser,
  setCurrentTeamForUser,
  getAllTeamsForUser,
} from "@/lib/db/queries";
import { validatedAction, validatedActionWithUser } from "@/lib/auth/proxy";
import { requireTeamOwner } from "@/lib/auth/privileges";
import { generateOTP, getOTPExpiration } from "@/lib/utils/otp";
import { sendOTPEmail, sendInvitationEmail } from "@/lib/utils/email";
import {
  generateInvitationToken,
  getInvitationExpiration,
  isInvitationExpired,
} from "@/lib/utils/invitation-token";

async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
  inviteId: z.string().optional(),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  const userWithTeam = await db
    .select({
      user: users,
      team: teams,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(users.email, email))
    .limit(1);

  if (userWithTeam.length === 0) {
    return {
      error: "Invalid email or password. Please try again.",
      email,
      password,
    };
  }

  const { user: foundUser, team: foundTeam } = userWithTeam[0];

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return {
      error: "Invalid email or password. Please try again.",
      email,
      password,
    };
  }

  // If there's an inviteId, check if there's a pending invitation for this user
  if (inviteId) {
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, parseInt(inviteId)),
          eq(invitations.email, email),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (invitation) {
      // Check if user is already a member of this team
      const existingMember = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.userId, foundUser.id),
          eq(teamMembers.teamId, invitation.teamId)
        ),
      });

      if (!existingMember) {
        // Add user to the team
        await db.insert(teamMembers).values({
          userId: foundUser.id,
          teamId: invitation.teamId,
          role: invitation.role,
        });

        // Set this team as the user's current team
        await db
          .update(users)
          .set({ currentTeamId: invitation.teamId })
          .where(eq(users.id, foundUser.id));

        // Mark invitation as accepted
        await db
          .update(invitations)
          .set({ status: "accepted" })
          .where(eq(invitations.id, invitation.id));

        // Log activity
        await logActivity(
          invitation.teamId,
          foundUser.id,
          ActivityType.ACCEPT_INVITATION
        );
      } else {
        // User is already a member, just mark invitation as accepted
        await db
          .update(invitations)
          .set({ status: "accepted" })
          .where(eq(invitations.id, invitation.id));
      }
    }
  }

  await Promise.all([
    setSession(foundUser),
    logActivity(foundTeam?.id, foundUser.id, ActivityType.SIGN_IN),
  ]);

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceId = formData.get("priceId") as string;
    // createCheckoutSession calls redirect() internally, which throws
    // The redirect will prevent this function from returning normally
    await createCheckoutSession({ team: foundTeam, priceId });
    // This line will never execute, but satisfies TypeScript
    return { success: "Redirecting to checkout..." };
  }

  redirect("/app/dashboard");
});

const sendOTPSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
  teamName: z.string().min(1).max(100).optional(),
  plan: z.string().optional(),
});

/**
 * Send OTP to email for verification
 */
export const sendOTP = validatedAction(
  sendOTPSchema,
  async (data, formData) => {
    const { email, password, inviteId, teamName, plan } = data;

    try {
      // Check if email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        // If there's an inviteId, redirect them to sign in with the inviteId
        if (inviteId) {
          return {
            error: `An account with this email already exists. Please sign in to accept the invitation.`,
            email,
            password,
            teamName,
            redirectToSignIn: true,
            inviteId,
          };
        }
        return {
          error:
            "An account with this email already exists. Please sign in instead.",
          email,
          password,
          teamName,
        };
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = getOTPExpiration();

      // Hash password to store temporarily
      const passwordHash = await hashPassword(password);

      // Delete any existing unverified OTPs for this email
      await db
        .delete(emailVerifications)
        .where(
          and(
            eq(emailVerifications.email, email),
            eq(emailVerifications.verified, false)
          )
        );

      // Store OTP and sign-up data
      await db.insert(emailVerifications).values({
        email,
        otp,
        expiresAt,
        passwordHash,
        teamName: teamName || null,
        plan: plan || null,
        inviteId: inviteId || null,
        verified: false,
      });

      // Send OTP email
      await sendOTPEmail(email, otp);

      return {
        success: "Verification code sent to your email",
        email, // Return email so UI can show it
      };
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      return {
        error: error.message || "Failed to send verification code",
        email,
        password,
        teamName,
      };
    }
  }
);

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

/**
 * Verify OTP and complete sign-up
 */
export const verifyOTP = validatedAction(verifyOTPSchema, async (data) => {
  const { email, otp } = data;

  try {
    // Find the verification record
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.email, email),
          eq(emailVerifications.otp, otp),
          eq(emailVerifications.verified, false),
          gt(emailVerifications.expiresAt, new Date()) // Not expired
        )
      )
      .limit(1);

    if (!verification) {
      return {
        error: "Invalid or expired verification code",
        email,
      };
    }

    // Check if email already exists (double-check)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      // Mark verification as used and return error
      await db
        .update(emailVerifications)
        .set({ verified: true })
        .where(eq(emailVerifications.id, verification.id));
      return {
        error:
          "An account with this email already exists. Please sign in instead.",
        email,
      };
    }

    // Mark verification as used
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.id, verification.id));

    // Now create the user and team with the stored data
    const passwordHash = verification.passwordHash!;
    const teamName = verification.teamName;
    const inviteId = verification.inviteId;
    const plan = verification.plan;

    const newUser: NewUser = {
      email,
      passwordHash,
      role: "owner", // Default role, will be overridden if there's an invitation
    };

    let createdUser;
    try {
      [createdUser] = await db.insert(users).values(newUser).returning();
    } catch (dbError: any) {
      console.error("Database error creating user:", dbError);
      if (dbError?.code === "23505") {
        return {
          error:
            "An account with this email already exists. Please sign in instead.",
          email,
        };
      }
      return {
        error: `Failed to create user: ${dbError?.message || "Unknown error"}`,
        email,
      };
    }

    if (!createdUser) {
      return {
        error: "Failed to create user. Please try again.",
        email,
      };
    }

    let teamId: number;
    let userRole: string;
    let createdTeam: typeof teams.$inferSelect | null = null;

    if (inviteId) {
      // Check if there's a valid invitation
      const [invitation] = await db
        .select()
        .from(invitations)
        .where(
          and(
            eq(invitations.id, parseInt(inviteId)),
            eq(invitations.email, email),
            eq(invitations.status, "pending")
          )
        )
        .limit(1);

      if (invitation) {
        teamId = invitation.teamId;
        userRole = invitation.role;

        await db
          .update(invitations)
          .set({ status: "accepted" })
          .where(eq(invitations.id, invitation.id));

        await logActivity(
          teamId,
          createdUser.id,
          ActivityType.ACCEPT_INVITATION
        );

        [createdTeam] = await db
          .select()
          .from(teams)
          .where(eq(teams.id, teamId))
          .limit(1);
      } else {
        return {
          error: "Invalid or expired invitation.",
          email,
        };
      }
    } else {
      // Create a new team if there's no invitation
      const newTeam: NewTeam = {
        name: teamName || `${email}'s Team`,
        billingPlan: BillingPlan.MONTHLY,
      };

      try {
        [createdTeam] = await db.insert(teams).values(newTeam).returning();
      } catch (dbError: any) {
        console.error("Database error creating team:", dbError);
        await db.delete(users).where(eq(users.id, createdUser.id));
        return {
          error: `Failed to create team: ${
            dbError?.message || "Unknown error"
          }`,
          email,
        };
      }

      if (!createdTeam) {
        await db.delete(users).where(eq(users.id, createdUser.id));
        return {
          error: "Failed to create team. Please try again.",
          email,
        };
      }

      teamId = createdTeam.id;
      userRole = "owner";

      await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
    }

    const newTeamMember: NewTeamMember = {
      userId: createdUser.id,
      teamId: teamId,
      role: userRole,
    };

    try {
      await Promise.all([
        db.insert(teamMembers).values(newTeamMember),
        logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
        setSession(createdUser),
      ]);
    } catch (dbError: any) {
      console.error("Database error creating team member:", dbError);
      await Promise.all([
        db.delete(users).where(eq(users.id, createdUser.id)),
        db.delete(teams).where(eq(teams.id, teamId)),
      ]);
      return {
        error: `Failed to complete sign-up: ${
          dbError?.message || "Unknown error"
        }`,
        email,
      };
    }

    // Determine plan - default to BASIC if no plan query param provided
    const selectedPlan = plan || "basic";

    // Determine price IDs based on plan selection
    const basicMonthlyPriceId = process.env.STRIPE_PRICE_BASIC_MONTHLY || "";
    const basicMeterPriceId = process.env.STRIPE_PRICE_BASIC_METER_USAGE || "";
    const proMonthlyPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY || "";
    const proMeterPriceId = process.env.STRIPE_PRICE_PRO_METER_USAGE || "";

    let priceId: string | undefined;
    let meterPriceId: string | undefined;
    let planType: PlanName | undefined;

    switch (selectedPlan) {
      case "basic":
        priceId = basicMonthlyPriceId;
        meterPriceId = basicMeterPriceId;
        planType = PlanName.BASIC;
        break;
      case "pro-monthly":
        priceId = proMonthlyPriceId;
        meterPriceId = proMeterPriceId;
        planType = PlanName.PRO;
        break;
    }

    // Redirect to checkout for the selected plan
    if (planType && priceId && meterPriceId) {
      await createCheckoutSession({
        team: createdTeam,
        priceId,
        meterPriceId,
        planType,
      });
      return { success: "Redirecting to checkout..." };
    }

    // If no plan selected or checkout setup failed, redirect to pricing
    // New users must select a plan and complete checkout before accessing the app
      redirect("/pricing");
  } catch (error: any) {
    // Re-throw redirect errors - they should not be caught
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Unexpected error during OTP verification:", error);
    return {
      error: `An unexpected error occurred: ${
        error?.message || "Please try again."
      }`,
      email,
    };
  }
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
  teamName: z.string().min(1).max(100).optional(),
});

// signUp is now deprecated - use sendOTP + verifyOTP instead
// Keeping for backward compatibility but it won't be used
export const signUp = validatedAction(signUpSchema, async (data) => {
  return {
    error: "Please use the email verification flow",
    email: data.email,
  };
});

export async function signOut() {
  const user = (await getUser()) as User;
  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete("session");
}

const acceptInviteForExistingUserSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Accept invitation for existing user (sign in and join team)
 */
export const acceptInviteForExistingUser = validatedAction(
  acceptInviteForExistingUserSchema,
  async (data) => {
    const { token, email, password } = data;

    // Find the invitation
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.token, token),
          eq(invitations.email, email),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (!invitation) {
      return {
        error: "Invalid or expired invitation",
        email,
      };
    }

    if (isInvitationExpired(invitation.expiresAt)) {
      return {
        error: "This invitation has expired",
        email,
      };
    }

    // Find the user
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!foundUser) {
      return {
        error: "User not found. Please use the sign-up form below.",
        email,
      };
    }

    // Verify password
    const isPasswordValid = await comparePasswords(
      password,
      foundUser.passwordHash
    );

    if (!isPasswordValid) {
      return {
        error: "Invalid password. Please try again.",
        email,
      };
    }

    // Check if user is already a member of this team
    const existingMember = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.userId, foundUser.id),
        eq(teamMembers.teamId, invitation.teamId)
      ),
    });

    if (!existingMember) {
      // Add user to the team
      await db.insert(teamMembers).values({
        userId: foundUser.id,
        teamId: invitation.teamId,
        role: invitation.role,
      });

      // Set this team as the user's current team
      await db
        .update(users)
        .set({ currentTeamId: invitation.teamId })
        .where(eq(users.id, foundUser.id));

      // Log activity
      await logActivity(
        invitation.teamId,
        foundUser.id,
        ActivityType.ACCEPT_INVITATION
      );
    }

    // Mark invitation as accepted
    await db
      .update(invitations)
      .set({ status: "accepted" })
      .where(eq(invitations.id, invitation.id));

    // Set session
    await setSession(foundUser);

    redirect("/app/dashboard");
  }
);

const acceptInviteForNewUserSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Accept invitation for new user (create account and join team, no OTP needed)
 */
export const acceptInviteForNewUser = validatedAction(
  acceptInviteForNewUserSchema,
  async (data) => {
    const { token, email, password } = data;

    // Find the invitation
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.token, token),
          eq(invitations.email, email),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (!invitation) {
      return {
        error: "Invalid or expired invitation",
        email,
      };
    }

    if (isInvitationExpired(invitation.expiresAt)) {
      return {
        error: "This invitation has expired",
        email,
      };
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        error:
          "An account with this email already exists. Please sign in above.",
        email,
      };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser: NewUser = {
      email,
      passwordHash,
      role: "owner", // Will be overridden by invitation role
    };

    let createdUser;
    try {
      [createdUser] = await db.insert(users).values(newUser).returning();
    } catch (dbError: any) {
      console.error("Database error creating user:", dbError);
      if (dbError?.code === "23505") {
        return {
          error:
            "An account with this email already exists. Please sign in instead.",
          email,
        };
      }
      return {
        error: `Failed to create user: ${dbError?.message || "Unknown error"}`,
        email,
      };
    }

    if (!createdUser) {
      return {
        error: "Failed to create user. Please try again.",
        email,
      };
    }

    // Add user to the team with the role from invitation
    const newTeamMember: NewTeamMember = {
      userId: createdUser.id,
      teamId: invitation.teamId,
      role: invitation.role,
    };

    try {
      await Promise.all([
        db.insert(teamMembers).values(newTeamMember),
        db
          .update(users)
          .set({ currentTeamId: invitation.teamId })
          .where(eq(users.id, createdUser.id)),
        db
          .update(invitations)
          .set({ status: "accepted" })
          .where(eq(invitations.id, invitation.id)),
        logActivity(invitation.teamId, createdUser.id, ActivityType.SIGN_UP),
        logActivity(
          invitation.teamId,
          createdUser.id,
          ActivityType.ACCEPT_INVITATION
        ),
        setSession(createdUser),
      ]);
    } catch (dbError: any) {
      console.error("Database error creating team member:", dbError);
      await db.delete(users).where(eq(users.id, createdUser.id));
      return {
        error: `Failed to complete sign-up: ${
          dbError?.message || "Unknown error"
        }`,
        email,
      };
    }

    redirect("/app/dashboard");
  }
);

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
});

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: "Current password is incorrect.",
      };
    }

    if (currentPassword === newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: "New password must be different from the current password.",
      };
    }

    if (confirmPassword !== newPassword) {
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        error: "New password and confirmation password do not match.",
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_PASSWORD),
    ]);

    return {
      success: "Password updated successfully.",
    };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        password,
        error: "Incorrect password. Account deletion failed.",
      };
    }

    const userWithTeam = await getUserWithTeam(user.id);

    await logActivity(
      userWithTeam?.teamId,
      user.id,
      ActivityType.DELETE_ACCOUNT
    );

    // Soft delete
    await db
      .update(users)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
      })
      .where(eq(users.id, user.id));

    if (userWithTeam?.teamId) {
      await db
        .delete(teamMembers)
        .where(
          and(
            eq(teamMembers.userId, user.id),
            eq(teamMembers.teamId, userWithTeam.teamId)
          )
        );
    }

    (await cookies()).delete("session");
    redirect("/sign-in");
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    return { name, success: "Account updated successfully." };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.coerce.number(),
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(userWithTeam.teamId);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      };
    }

    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.id, memberId),
          eq(teamMembers.teamId, userWithTeam.teamId)
        )
      );

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: "Team member removed successfully" };
  }
);

const updateTeamMemberRoleSchema = z.object({
  memberId: z.coerce.number(),
  role: z.enum(["member", "owner"]),
});

export const updateTeamMemberRole = validatedActionWithUser(
  updateTeamMemberRoleSchema,
  async (data, _, user) => {
    const { memberId, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(userWithTeam.teamId);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      };
    }

    // Get the member being updated
    const memberToUpdate = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.id, memberId),
        eq(teamMembers.teamId, userWithTeam.teamId)
      ),
    });

    if (!memberToUpdate) {
      return { error: "Team member not found" };
    }

    // Prevent changing your own role
    if (memberToUpdate.userId === user.id) {
      return { error: "You cannot change your own role" };
    }

    // Update the role
    await db
      .update(teamMembers)
      .set({ role })
      .where(eq(teamMembers.id, memberId));

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.UPDATE_TEAM_MEMBER
    );

    return { success: "Team member role updated successfully" };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "owner"]),
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(userWithTeam.teamId);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      };
    }

    const existingMember = await db
      .select()
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .where(
        and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
      )
      .limit(1);

    if (existingMember.length > 0) {
      return { error: "User is already a member of this team" };
    }

    // Check if there's an existing invitation
    const existingInvitation = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.teamId, userWithTeam.teamId),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      return { error: "An invitation has already been sent to this email" };
    }

    // Get team name and inviter name
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, userWithTeam.teamId))
      .limit(1);

    const [inviter] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    // Check if user with this email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      // User exists - create notifications for all their teams
      const userTeams = await db.query.teamMembers.findMany({
        where: eq(teamMembers.userId, existingUser.id),
        with: {
          team: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Create notifications for each team the user is in
      const notificationPromises = userTeams.map((userTeam) =>
        db.insert(notifications).values({
          teamId: userTeam.teamId,
          type: NotificationType.TEAM_INVITATION,
          title: `Team Invitation: ${team?.name || "Unknown Team"}`,
          message: `${inviter?.name || "Someone"} has invited you to join ${team?.name || "a team"} as a ${role}.`,
          metadata: {
            invitationTeamId: userWithTeam.teamId,
            invitationTeamName: team?.name || "Unknown Team",
            role,
            inviterName: inviter?.name || null,
            inviterEmail: inviter?.email || null,
          },
          status: "UNREAD",
        })
      );

      await Promise.all(notificationPromises);

      await logActivity(
        userWithTeam.teamId,
        user.id,
        ActivityType.INVITE_TEAM_MEMBER
      );

      return {
        success: `Invitation sent. ${existingUser.name || "The user"} will receive a notification in their account.`,
      };
    }

    // User doesn't exist - create invitation and send email
    const token = generateInvitationToken();
    const expiresAt = getInvitationExpiration();

    const [createdInvitation] = await db
      .insert(invitations)
      .values({
        teamId: userWithTeam.teamId,
        email,
        role,
        invitedBy: user.id,
        status: "pending",
        token,
        expiresAt,
      })
      .returning();

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    // Send invitation email with token-based magic link
    await sendInvitationEmail(
      email,
      team?.name || "the team",
      role,
      token,
      inviter?.name || undefined
    );

    return { success: "Invitation sent successfully" };
  }
);

const deleteInvitationSchema = z.object({
  invitationId: z.string().transform((val) => parseInt(val, 10)),
});

export const deleteInvitation = validatedActionWithUser(
  deleteInvitationSchema,
  async (data, _, user) => {
    const { invitationId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(userWithTeam.teamId);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      };
    }

    // Get the invitation to verify it belongs to the team
    const invitationResult = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.teamId, userWithTeam.teamId)
        )
      )
      .limit(1);

    if (invitationResult.length === 0) {
      return { error: "Invitation not found" };
    }

    const invitation = invitationResult[0];

    // Only allow deleting pending invitations
    if (invitation.status !== "pending") {
      return {
        error: "Only pending invitations can be deleted",
      };
    }

    // Delete the invitation
    await db.delete(invitations).where(eq(invitations.id, invitationId));

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER // Reusing activity type
    );

    return { success: "Invitation deleted successfully" };
  }
);

const resendInvitationSchema = z.object({
  invitationId: z.string().transform((val) => parseInt(val, 10)),
});

export const resendInvitation = validatedActionWithUser(
  resendInvitationSchema,
  async (data, _, user) => {
    const { invitationId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(userWithTeam.teamId);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      };
    }

    // Get the invitation with related data
    const invitationResult = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.teamId, userWithTeam.teamId)
        )
      )
      .limit(1);

    if (invitationResult.length === 0) {
      return { error: "Invitation not found" };
    }

    const inv = invitationResult[0];

    // Only allow resending pending invitations
    if (inv.status !== "pending") {
      return {
        error: "Only pending invitations can be resent",
      };
    }

    // Get team name and inviter name for email
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, userWithTeam.teamId))
      .limit(1);

    const [inviter] = await db
      .select()
      .from(users)
      .where(eq(users.id, inv.invitedBy))
      .limit(1);

    // Resend the invitation email
    await sendInvitationEmail(
      inv.email,
      team?.name || "the team",
      inv.role,
      inv.token,
      inviter?.name || undefined
    );

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER // Reusing activity type
    );

    return { success: "Invitation resent successfully" };
  }
);

const updateTeamNameSchema = z.object({
  teamName: z
    .string()
    .min(1, "Team name is required")
    .max(100, "Team name must be 100 characters or less"),
});

export const updateTeamName = validatedActionWithUser(
  updateTeamNameSchema,
  async (data, _, user) => {
    const { teamName } = data;
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" };
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      };
    }

    await db
      .update(teams)
      .set({
        name: teamName,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, team.id));

    await logActivity(team.id, user.id, ActivityType.UPDATE_TEAM);

    return { success: "Team name updated successfully" };
  }
);

// Schema accepts any record with string keys and "true"/"false" values
// We'll filter for preference_* keys in the action
const updateNotificationPreferencesSchema = z.record(
  z.string(),
  z.enum(["true", "false"])
);

export const updateNotificationPreferences = validatedActionWithUser(
  updateNotificationPreferencesSchema,
  async (data, _, user) => {
    // Extract preferences from form data keys like "preference_APPLICATION_RECEIVED"
    const notificationPreferences: Record<string, boolean> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("preference_")) {
        const notificationType = key.replace("preference_", "");
        notificationPreferences[notificationType] = value === "true";
      }
    });

    // Store preferences as JSONB in users table
    await db
      .update(users)
      .set({
        notificationPreferences: notificationPreferences as any,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: "Notification preferences updated successfully" };
  }
);

const switchTeamSchema = z.object({
  teamId: z.string().transform((val) => parseInt(val, 10)),
});

export const switchTeam = validatedActionWithUser(
  switchTeamSchema,
  async (data, _, user) => {
    const { teamId } = data;

    const success = await setCurrentTeamForUser(teamId);
    if (!success) {
      return {
        error: "You are not a member of this team or team not found",
      };
    }

    await logActivity(teamId, user.id, ActivityType.SIGN_IN);

    return { success: "Team switched successfully" };
  }
);
