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
import CardWrapper from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { login } from "@/lib/actions/login";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await login(values);

      if (response?.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      setSuccess("Login successful! Redirecting...");

      // Instead of trying multiple redirect approaches, use a simple one that works
      setTimeout(() => {
        // Force a hard navigation to the dashboard
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      setError(error?.message || "Something went wrong");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true, // Force redirect handling by NextAuth
      });
    } catch (error: any) {
      // This might not execute as the redirect happens
      setError("Failed to sign in with Google");
      console.error("Google sign-in error:", error);
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Log in to your account"
      title="Login"
      backButtonHref="/register"
      backButtonLabel="Don't have an account? Register here."
    >
      {/* Google Auth Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </Button>

      {/* OR Separator */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">OR</span>
        </div>
      </div>

      {/* Email/Password Form */}
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
                      disabled={loading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/reset-password">Forgot password?</Link>
            </Button>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login with Email"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
