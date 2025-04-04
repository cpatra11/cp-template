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
}

export default function CardWrapper({
  children,
  headerLabel,
  title,
  backButtonLabel,
  backButtonHref,
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
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
