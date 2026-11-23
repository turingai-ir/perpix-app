import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@perpix/ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors select-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        glass: "glass text-foreground",
        tinted: "glass-tinted",
        brand: "glass-brand",
        success: "glass-tinted text-success-foreground glass-tint-success",
        destructive:
          "glass-tinted text-destructive-foreground glass-tint-destructive",
        outline: "glass-outline text-foreground",
        subtle: "glass-subtle text-muted-foreground",
      },
      shape: {
        rounded: "rounded-control",
        pill: "rounded-full",
      },
      size: {
        sm: "px-2 py-0.5 text-caption",
        default: "px-2.5 py-1 text-footnote",
        lg: "px-3 py-1.5 text-body",
      },
    },
    defaultVariants: {
      variant: "glass",
      shape: "pill",
      size: "default",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, shape, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? "glass"}
      className={cn(badgeVariants({ variant, shape, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, type BadgeProps };
