import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";

/*
 * Glass buttons (control radius: works for both B2C and dense B2B screens).
 * Variants:
 *  - glass: neutral translucent glass (default)
 *  - tinted: primary action (brand violet liquid tint)
 *  - brand: hero gradient liquid glass
 *  - success: emerald positive action
 *  - destructive: red warning/danger action
 *  - outline: crisp crystal glass with subtle fill
 *  - subtle: low-contrast frosted glass for toolbars
 *  - plain: text-only with hover tint
 *
 * Shapes:
 *  - rounded: control radius (default)
 *  - pill: full round radius (FAB, pill bars, media controls)
 *
 * Sizes:
 *  - xs, sm, default, lg, xl
 *  - icon-xs, icon-sm, icon, icon-lg, icon-xl
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 pressable items-center justify-center gap-2 text-body font-semibold whitespace-nowrap focus-ring transition-[filter,background-color,transform] duration-(--duration-press) select-none data-disabled:pointer-events-none data-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        glass: "glass hover:brightness-105 active:brightness-95",
        tinted: "glass-tinted hover:brightness-110 active:brightness-95",
        brand: "glass-brand hover:brightness-110 active:brightness-95",
        success:
          "glass-tinted text-success-foreground glass-tint-success hover:brightness-110 active:brightness-95",
        destructive:
          "glass-tinted text-destructive-foreground glass-tint-destructive hover:brightness-110 active:brightness-95",
        outline: "glass-outline active:brightness-95",
        subtle: "glass-subtle active:brightness-95",
        plain: "text-primary hover:bg-foreground/6 active:bg-foreground/10",
      },
      shape: {
        rounded: "rounded-control",
        pill: "rounded-full",
      },
      size: {
        xs: "h-7 px-2.5 text-caption pointer-coarse:h-9 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3.5 text-footnote pointer-coarse:h-10",
        default: "h-10 px-5 pointer-coarse:h-11",
        lg: "h-12 px-6 text-headline pointer-coarse:h-13",
        xl: "h-14 px-8 text-title-3 pointer-coarse:h-15 [&_svg:not([class*='size-'])]:size-5.5",
        "icon-xs":
          "size-7 pointer-coarse:size-9 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 pointer-coarse:size-10",
        icon: "size-10 pointer-coarse:size-11",
        "icon-lg": "size-12 pointer-coarse:size-13",
        "icon-xl":
          "size-14 pointer-coarse:size-15 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: { variant: "glass", shape: "rounded", size: "default" },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function Button({
  className,
  variant,
  shape,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant ?? "glass"}
      data-shape={shape ?? "rounded"}
      data-size={size ?? "default"}
      data-loading={loading ? "" : undefined}
      aria-busy={loading ? "true" : undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, shape, size }), className)}
      {...props}
    >
      {loading ? (
        <CircleNotchIcon
          aria-hidden="true"
          className="shrink-0 animate-spin text-current"
        />
      ) : null}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants, type ButtonProps };
