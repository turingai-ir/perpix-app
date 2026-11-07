import type { FC, ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Heading2, Paragraph } from "@/shared/ui/typography";
import { AuthReaction } from "./auth-reaction";

interface AuthCardProps {
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
  reaction?: { id: number; kind: "password" | "code"; message: string };
}

export const AuthCard: FC<AuthCardProps> = ({
  title,
  description,
  footer,
  children,
  reaction,
}) => (
  <div className="relative isolate w-full max-w-full">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="mb-8 flex w-full items-center gap-3.5" aria-hidden="true">
          <img
            src="/android-chrome-192x192.png"
            alt=""
            className="size-10 rounded-xl border border-primary/40 bg-accent object-contain p-1.5"
          />
          <span className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent rtl:bg-gradient-to-l" />
        </div>
        <CardTitle>
          <Heading2>{title}</Heading2>
        </CardTitle>
        <CardDescription>
          <Paragraph>{description}</Paragraph>
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
    {reaction ? (
      <AuthReaction
        key={reaction.id}
        kind={reaction.kind}
        message={reaction.message}
      />
    ) : null}
  </div>
);
