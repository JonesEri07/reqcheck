/**
 * Email utility functions using Resend
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Get the base URL for the application
 */
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Send OTP email to user
 */
export async function sendOTPEmail(email: string, otp: string) {
  try {
    // If no API key is set, fall back to console logging (for development)
    if (!process.env.RESEND_API_KEY) {
      console.log(`[EMAIL] Sending OTP to ${email}: ${otp}`);
      console.log(
        "⚠️  RESEND_API_KEY not set. Add it to your .env file to send actual emails."
      );
      return true;
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "noreply@support.reqcheck.io";

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Verify your email address</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Failed to send OTP email:", result.error);
      // Fall back to console logging if email fails
      console.log(`[EMAIL] OTP for ${email}: ${otp}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // Fall back to console logging if email fails
    console.log(`[EMAIL] OTP for ${email}: ${otp}`);
    return false;
  }
}

/**
 * Send team invitation email to user
 */
export async function sendInvitationEmail(
  email: string,
  teamName: string,
  role: string,
  inviteId: number,
  inviterName?: string
) {
  try {
    // If no API key is set, fall back to console logging (for development)
    if (!process.env.RESEND_API_KEY) {
      console.log(
        `[EMAIL] Sending invitation to ${email} for team ${teamName} (${role})`
      );
      console.log(
        `[EMAIL] Invitation link: ${getBaseUrl()}/sign-up?inviteId=${inviteId}`
      );
      console.log(
        "⚠️  RESEND_API_KEY not set. Add it to your .env file to send actual emails."
      );
      return true;
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "noreply@support.reqcheck.io";
    const baseUrl = getBaseUrl();
    const signUpUrl = `${baseUrl}/sign-up?inviteId=${inviteId}`;
    const inviterText = inviterName ? `${inviterName} has` : "You have been";

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `You've been invited to join ${teamName} on reqCHECK`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">You've been invited!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            ${inviterText} invited you to join <strong>${teamName}</strong> on reqCHECK as a <strong>${role}</strong>.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 20px;">
            reqCHECK helps teams verify candidate skills through automated challenges, preventing spam and unqualified applicants.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${signUpUrl}"
              style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;"
            >
              Accept Invitation
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #6b7280; font-size: 14px; word-break: break-all;">
            ${signUpUrl}
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Failed to send invitation email:", result.error);
      // Fall back to console logging if email fails
      console.log(
        `[EMAIL] Invitation for ${email} to team ${teamName}: ${signUpUrl}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending invitation email:", error);
    // Fall back to console logging if email fails
    const baseUrl = getBaseUrl();
    const signUpUrl = `${baseUrl}/sign-up?inviteId=${inviteId}`;
    console.log(
      `[EMAIL] Invitation for ${email} to team ${teamName}: ${signUpUrl}`
    );
    return false;
  }
}
