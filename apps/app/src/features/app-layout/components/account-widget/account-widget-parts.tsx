import { type ComponentProps, type FC } from "react";

import { cn } from "@/shared/lib/utils";

/** Translucent block used by every section of the account panel. */
export const AccountBlock: FC<ComponentProps<"section">> = ({
  className,
  ...props
}) => (
  <section
    className={cn(
      "rounded-xl bg-night-foreground/6 p-4 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--night-foreground)_8%,transparent)]",
      className,
    )}
    {...props}
  />
);

/** Small dimmed caption above a value. */
export const AccountLabel: FC<ComponentProps<"small">> = ({
  className,
  ...props
}) => (
  <small
    className={cn("text-xs text-night-foreground/65", className)}
    {...props}
  />
);

/** Unit suffix such as "token" next to an amount. */
export const AccountUnit: FC<ComponentProps<"em">> = ({
  className,
  ...props
}) => (
  <em
    className={cn(
      "text-xs font-semibold text-night-foreground/65 not-italic",
      className,
    )}
    {...props}
  />
);
