import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors select-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        glass: "glass text-foreground",
        tinted: "glass-tinted",
        brand: "glass-brand",
        success: "glass-tinted glass-tint-success",
        destructive:
          "glass-tinted glass-tint-destructive",
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

type DotVariant = "default" | "success" | "destructive" | "warning" | "brand";

const dotClasses: Record<DotVariant, string> = {
  default: "bg-foreground/50",
  success: "bg-success animate-pulse",
  destructive: "bg-destructive",
  warning: "bg-warning",
  brand: "bg-primary animate-pulse",
};

/**
 * Formats a count with localized Persian numerals and overflow handling (e.g. 100 -> "+۹۹").
 */
function formatBadgeCount(count: number, overflowCount = 99): string {
  if (count > overflowCount) {
    const formattedMax = overflowCount.toLocaleString("fa-IR");
    return `+${formattedMax}`;
  }
  return count.toLocaleString("fa-IR");
}

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Whether to show a status indicator dot before the content. */
    dot?: boolean;
    /** Color/variant of the status dot. Defaults to "default". */
    dotVariant?: DotVariant;
    /** Optional numeric count badge (e.g. unread count). Formats with localized numerals and overflow. */
    count?: number;
    /** Max count before displaying overflow indicator. Defaults to 99. */
    overflowCount?: number;
    /** Whether the badge can be removed/dismissed. Displays an X button. */
    removable?: boolean;
    /** Callback when the remove button is clicked. */
    onRemove?: () => void;
    /** Accessible label for the remove button. Defaults to "حذف". */
    removeLabel?: string;
    /** Interactive pressable chip styling. */
    interactive?: boolean;
  };

function Badge({
  className,
  variant,
  shape,
  size,
  dot,
  dotVariant = "default",
  count,
  overflowCount = 99,
  removable,
  onRemove,
  removeLabel = "حذف",
  interactive,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? "glass"}
      className={cn(
        badgeVariants({ variant, shape, size }),
        interactive &&
          "cursor-pointer pressable active:scale-95 hover:brightness-110",
        removable && "pe-1.5",
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          data-slot="badge-dot"
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", dotClasses[dotVariant])}
        />
      ) : null}
      {children}
      {count !== undefined ? (
        <span data-slot="badge-count" className={cn(children && "ms-1")}>
          {formatBadgeCount(count, overflowCount)}
        </span>
      ) : null}
      {removable ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ms-0.5 -me-0.5 inline-flex size-4 items-center justify-center rounded-full opacity-60 hover:opacity-100 hover:bg-foreground/15 transition-all focus-ring relative pointer-coarse:before:absolute pointer-coarse:before:-inset-2.5 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px]"
        >
          <XIcon aria-hidden className="size-3" />
        </button>
      ) : null}
    </span>
  );
}

export {
  Badge,
  badgeVariants,
  formatBadgeCount,
  type BadgeProps,
  type DotVariant,
};
