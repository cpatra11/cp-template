"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/data/user";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  try {
    // Validate the input data
    const validatedFields = LoginSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { email, password } = validatedFields.data;

    // Log before sign in attempt
    console.log("Login attempt for:", email);

    try {
      // Use a simpler approach with the credentials provider
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // If we get here, the sign-in was successful (no errors were thrown)
      console.log("Sign-in successful");
      return { success: "Login successful" };
    } catch (error) {
      console.error("Sign-in error:", error);

      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin") {
          return { error: "Invalid credentials" };
        }
        return { error: error.message || "Authentication error" };
      }

      return { error: "Failed to sign in" };
    }
  } catch (error) {
    console.error("Login action error:", error);
    return { error: "Something unexpected happened" };
  }
};
