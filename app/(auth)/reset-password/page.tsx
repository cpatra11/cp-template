"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useState } from "react";

import CardWrapper from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { sendResetPassword } from "@/actions/reset-password";
import { FormSuccess } from "@/components/auth/form-success";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    setLoading(true);
    sendResetPassword(data).then((res) => {
      if (res?.error) {
        setError(res?.error);
        setLoading(false);
      }
      if (res?.success) {
        setSuccess(res?.success);
        setLoading(false);
      }
    });
  };

  return (
    <div className="xl:w-1/4 md:w-1/2 w-full px-10 sm:px-0">
      <CardWrapper
        headerLabel="Enter your email address"
        title="Reset Password"
        backButtonHref="/sign-in"
        backButtonLabel="Back to Sign In"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="johndoe@email.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <Button
                size="sm"
                variant="link"
                asChild
                className="px-0 font-normal"
              >
                <Link href="/sign-in">Back to Sign In</Link>
              </Button> */}
            </div>
            <FormSuccess message={success} />

            <FormError message={error} />
            <Button type="submit" className="w-full">
              {loading ? "Sending Email..." : "Send Email"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default ResetPassword;
