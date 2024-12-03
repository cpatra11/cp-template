"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import CardWrapper from "@/components/auth/card-wrapper";
import { resetPasswordWithToken } from "@/actions/reset-password";
import bcrypt from "bcryptjs";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import { FormSuccess } from "@/components/auth/form-success";

const NewPassword = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof NewPasswordSchema>) => {
      if (success || error) {
        return;
      }

      if (!token) {
        setError("No token provided");
        return;
      }

      setLoading(true);

      try {
        // Reset password with the token and new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        const response = await resetPasswordWithToken(token, hashedPassword);

        if (response?.error) {
          setError(response?.error);
        } else {
          setSuccess("Password reset successful!");
          setLoading(false);
        }
      } catch (err) {
        setError("An error occurred while resetting the password.");
        setLoading(false);
      }
    },
    [token, success, error]
  );

  return (
    <div className="xl:w-1/4 md:w-1/2 w-full px-10 sm:px-0">
      <CardWrapper
        headerLabel="Enter a completely new password"
        title="New Password"
        backButtonHref="/sign-in"
        backButtonLabel="Back to login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter new password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Type password again"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormSuccess message={success} />
            <FormError message={error} />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default NewPassword;
