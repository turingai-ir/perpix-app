import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@perpix/ui/lib/utils";

const skeletonVariants = cva(
  "relative overflow-hidden transition-colors select-none",
  {
    variants: {
      variant: {
        glass:
          "bg-black/[0.07] dark:bg-white/[0.12] border border-glass-edge-light/30 shadow-[inset_0_1px_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]",
        subtle: "bg-black/[0.04] dark:bg-white/[0.06]",
        card: "glass-flat bg-card/85 border border-glass-edge-light/50 shadow-inner",
        tinted:
          "bg-primary/[0.12] dark:bg-primary/[0.22] border border-primary/25",
      },
      shape: {
        rounded: "rounded-control",
        card: "rounded-card",
        pill: "rounded-full",
        text: "h-4 rounded-md",
      },
      animation: {
        shimmer:
          "after:absolute after:inset-y-0 after:w-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent dark:after:via-white/20 rtl:after:bg-gradient-to-l after:pointer-events-none motion-reduce:after:animate-none",
        pulse: "animate-pulse motion-reduce:animate-none",
        none: "animate-none",
      },
    },
    defaultVariants: {
      variant: "glass",
      shape: "rounded",
      animation: "shimmer",
    },
  },
);

type SkeletonProps = ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants>;

/**
 * Skeleton placeholder displaying simulated content layout during data fetching.
 */
function Skeleton({
  className,
  variant,
  shape,
  animation,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-variant={variant ?? "glass"}
      data-shape={shape ?? "rounded"}
      aria-hidden="true"
      className={cn(skeletonVariants({ variant, shape, animation }), className)}
      {...props}
    />
  );
}

type SkeletonTextProps = ComponentProps<"div"> & {
  /** Number of text lines to generate (default 3) */
  lines?: number;
  /** Gap between text lines (default gap-2) */
  gap?: string;
  /** Skeleton variant to apply */
  variant?: VariantProps<typeof skeletonVariants>["variant"];
  /** Animation mode (default shimmer) */
  animation?: VariantProps<typeof skeletonVariants>["animation"];
};

/**
 * Convenience helper rendering multi-line skeleton text with staggered natural line widths.
 */
function SkeletonText({
  lines = 3,
  gap = "gap-2",
  variant = "glass",
  animation = "shimmer",
  className,
  ...props
}: SkeletonTextProps) {
  const lineArray = Array.from({ length: Math.max(1, lines) });

  return (
    <div
      data-slot="skeleton-text"
      className={cn("flex flex-col w-full", gap, className)}
      {...props}
    >
      {lineArray.map((_, idx) => {
        const isLast = idx === lineArray.length - 1;
        const widthClass =
          isLast && lineArray.length > 1
            ? "w-3/5"
            : idx % 2 === 1
              ? "w-4/5"
              : "w-full";

        return (
          <Skeleton
            key={idx}
            shape="text"
            variant={variant}
            animation={animation}
            className={widthClass}
          />
        );
      })}
    </div>
  );
}

export { Skeleton, SkeletonText, skeletonVariants };
export type { SkeletonProps, SkeletonTextProps };
