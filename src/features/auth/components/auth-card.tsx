import type { FC, ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading2, Paragraph } from "@/components/ui/typography";
import { AuthReaction } from "./auth-reaction";
import styles from "./auth-reaction.module.css";

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
  <div className={styles.stage}>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className={styles.brandMark} aria-hidden="true">
          <img src="/android-chrome-192x192.png" alt="" />
          <span />
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
