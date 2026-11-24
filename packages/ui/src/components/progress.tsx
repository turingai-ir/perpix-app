import { createContext, useContext, useMemo } from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@perpix/ui/lib/utils";

type ProgressContextValue = {
  variant?: VariantProps<typeof progressTrackVariants>["variant"];
  size?: VariantProps<typeof progressTrackVariants>["size"];
  shape?: VariantProps<typeof progressTrackVariants>["shape"];
};

const ProgressContext = createContext<ProgressContextValue>({
  variant: "brand",
  size: "default",
  shape: "pill",
});

const progressTrackVariants = cva(
  "relative w-full overflow-hidden transition-all backdrop-blur-sm border border-glass-edge-light/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.14)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]",
  {
    variants: {
      variant: {
        brand: "bg-primary/[0.08] dark:bg-primary/[0.18] border-primary/25",
        tinted: "bg-primary/[0.08] dark:bg-primary/[0.18] border-primary/25",
        glass:
          "bg-foreground/[0.06] dark:bg-foreground/[0.12] border-glass-edge-light/60",
        success: "bg-success/[0.08] dark:bg-success/[0.18] border-success/25",
        warning: "bg-warning/[0.08] dark:bg-warning/[0.18] border-warning/25",
        destructive:
          "bg-destructive/[0.08] dark:bg-destructive/[0.18] border-destructive/25",
        accent:
          "bg-accent-violet/[0.08] dark:bg-accent-violet/[0.18] border-accent-violet/25",
      },
      size: {
        xs: "h-1.5",
        sm: "h-2",
        default: "h-3",
        lg: "h-4.5",
      },
      shape: {
        rounded: "rounded-control",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "default",
      shape: "pill",
    },
  },
);

const progressVariants = progressTrackVariants;

const progressIndicatorVariants = cva(
  "relative h-full transition-all duration-300 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] data-[status=indeterminate]:animate-indeterminate-progress motion-reduce:animate-none",
  {
    variants: {
      variant: {
        brand:
          "bg-gradient-to-r from-magenta-brand via-violet-brand to-cyan-brand rtl:bg-gradient-to-l shadow-[0_0_14px_oklch(0.65_0.22_310_/_45%)]",
        tinted:
          "bg-gradient-to-r from-violet-brand via-primary to-accent-violet rtl:bg-gradient-to-l shadow-[0_0_12px_oklch(0.55_0.22_305_/_40%)]",
        glass:
          "bg-gradient-to-r from-neutral-700 via-neutral-800 to-neutral-900 dark:from-neutral-200 dark:via-white dark:to-neutral-100 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.35)]",
        success:
          "bg-gradient-to-r from-accent-teal via-success to-accent-emerald rtl:bg-gradient-to-l shadow-[0_0_12px_oklch(0.85_0.14_165_/_40%)]",
        warning:
          "bg-gradient-to-r from-accent-orange via-warning to-accent-gold rtl:bg-gradient-to-l shadow-[0_0_12px_oklch(0.85_0.12_85_/_40%)]",
        destructive:
          "bg-gradient-to-r from-destructive via-accent-rose to-accent-pink rtl:bg-gradient-to-l shadow-[0_0_12px_oklch(0.71_0.17_12_/_45%)]",
        accent:
          "bg-gradient-to-r from-accent-violet via-accent-blue to-accent-sky rtl:bg-gradient-to-l shadow-[0_0_12px_oklch(0.72_0.12_250_/_45%)]",
      },
      shape: {
        rounded: "rounded-control",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "brand",
      shape: "pill",
    },
  },
);

type ProgressProps = Omit<ProgressPrimitive.Root.Props, "value"> &
  VariantProps<typeof progressTrackVariants> & {
    /**
     * The current value. The component is indeterminate when value is `null` or omitted.
     * @default null
     */
    value?: number | null;
    /** Optional class name for the indicator element when using standalone Progress */
    indicatorClassName?: string;
  };

/**
 * Root container for progress bar displaying task completion status.
 * Can be used as a standalone self-contained progress bar, or with compound parts:
 * `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`.
 */
function Progress({
  className,
  children,
  variant = "brand",
  size = "default",
  shape = "pill",
  locale = "fa-IR",
  value = null,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const contextValue = useMemo(
    () => ({ variant, size, shape }),
    [variant, size, shape],
  );

  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      data-variant={variant ?? "brand"}
      locale={locale}
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      <ProgressContext.Provider value={contextValue}>
        {children ?? (
          <ProgressTrack variant={variant} size={size} shape={shape}>
            <ProgressIndicator
              variant={variant}
              shape={shape}
              className={indicatorClassName}
            />
          </ProgressTrack>
        )}
      </ProgressContext.Provider>
    </ProgressPrimitive.Root>
  );
}

type ProgressTrackProps = ProgressPrimitive.Track.Props &
  VariantProps<typeof progressTrackVariants>;

function ProgressTrack({
  className,
  variant: variantProp,
  size: sizeProp,
  shape: shapeProp,
  ...props
}: ProgressTrackProps) {
  const context = useContext(ProgressContext);
  const variant = variantProp ?? context.variant;
  const size = sizeProp ?? context.size;
  const shape = shapeProp ?? context.shape;

  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      data-variant={variant ?? undefined}
      className={cn(progressTrackVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}

type ProgressIndicatorProps = ProgressPrimitive.Indicator.Props &
  VariantProps<typeof progressIndicatorVariants>;

function ProgressIndicator({
  className,
  variant: variantProp,
  shape: shapeProp,
  ...props
}: ProgressIndicatorProps) {
  const context = useContext(ProgressContext);
  const variant = variantProp ?? context.variant;
  const shape = shapeProp ?? context.shape;

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      data-variant={variant ?? undefined}
      className={cn(progressIndicatorVariants({ variant, shape }), className)}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("text-footnote font-medium text-foreground", className)}
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn(
        "ms-auto text-caption font-medium text-muted-foreground tabular-nums select-none",
        className,
      )}
      {...props}
    />
  );
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  progressVariants,
  progressTrackVariants,
  progressIndicatorVariants,
};
export type { ProgressProps, ProgressTrackProps, ProgressIndicatorProps };
