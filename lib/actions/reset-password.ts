"use server";

import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/data/user";
import { z } from "zod";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getVerificationTokenByToken } from "@/lib/data/verification-token";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { get } from "http";

export const sendResetPassword = async (
  data: z.infer<typeof ResetPasswordSchema>
) => {
  // Validate the input data
  const validatedData = ResetPasswordSchema.parse(data);

  // If the data is invalid, return an error
  if (!validatedData) {
    return { error: "Invalid input data" };
  }

  // Destructure the validated data
  const { email } = validatedData;

  const user = await getUserByEmail(email);

  if (!user || !user.email) {
    return { error: "User does not exist" };
  }

  try {
    // Generate a password reset token (you can use a JWT token or a secure random string)
    const resetToken = generatePasswordResetToken(email);

    // Send the password reset email with the token
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/new?token=${
      (await resetToken).token
    }`;
    await sendPasswordResetEmail(email, resetLink);
  } catch (error) {
    return {
      error: "Failed to send password reset email. Please try again later.",
    };
  }

  return { success: "Password reset link sent to your email address." };
};
export const resetPasswordWithToken = async (
  token: string,
  password: string
) => {
  // Validate the token
  const verifiedToken = await getVerificationTokenByToken(token);

  // If the token is invalid, return an error
  if (!verifiedToken) {
    return { error: "Invalid or expired token" };
  }

  // Reset the password
  const ResetPassword = await resetPassword(verifiedToken.email, password);

  // If the password reset fails, return an error
  if (!ResetPassword) {
    return { error: "Failed to reset password. Please try again later." };
  }

  return { success: "Password reset successful" };
};

const resetPassword = async (email: string, password: string) => {
  // Update the user's password in the database
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  });

  await prisma.verificationToken.deleteMany({
    where: {
      email,
    },
  });

  return true;
};
