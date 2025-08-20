"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  title: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export default function CardWrapper({
  children,
  headerLabel,
  title,
  backButtonLabel,
  backButtonHref,
  showSocial = false,
}: CardWrapperProps) {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm">{headerLabel}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>

      {showSocial ? (
        <div className="px-6 pb-4">
          <div className="text-center text-sm text-muted-foreground mb-2">
            Or continue with
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 rounded border">Google</button>
            <button className="flex-1 px-3 py-2 rounded border">GitHub</button>
          </div>
        </div>
      ) : null}
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
