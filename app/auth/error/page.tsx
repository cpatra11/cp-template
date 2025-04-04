"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.");
          break;
        case "AccessDenied":
          setErrorMessage("You do not have access to this resource.");
          break;
        case "Verification":
          setErrorMessage("The verification token has expired or is invalid.");
          break;
        case "OAuthSignin":
          setErrorMessage("Error in the OAuth sign in process.");
          break;
        default:
          setErrorMessage("An unknown authentication error occurred.");
          break;
      }
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            Authentication Error
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-red-500">
            {errorMessage || "Something went wrong during authentication."}
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/sign-in">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
