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

interface AuthCardProps {
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const AuthCard: FC<AuthCardProps> = ({
  title,
  description,
  footer,
  children,
}) => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>
        <Heading2 className="text-center">{title}</Heading2>
      </CardTitle>
      <CardDescription>
        <Paragraph className="text-center">{description}</Paragraph>
      </CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
    {footer ? (
      <CardFooter className="flex-col gap-1">{footer}</CardFooter>
    ) : null}
  </Card>
);
