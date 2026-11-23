import * as React from "react";

import { cn } from "@perpix/ui/lib/utils";

const Heading2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
));

Heading2.displayName = "Heading2";

const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  >
    {children}
  </p>
));

Paragraph.displayName = "Paragraph";

const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));

Muted.displayName = "Muted";

export { Heading2, Paragraph, Muted };
