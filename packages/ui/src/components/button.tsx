import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@perpix/ui/lib/utils";

/*
 * Glass buttons (control radius: works for both B2C and dense B2B screens). glass = neutral (default), tinted = primary action, destructive = red tint,
 * plain = text-only. Coarse pointers get 44px+ targets; tap feedback via `pressable`.
 */
const buttonVariants = cva(
  "pressable focus-ring relative inline-flex shrink-0 items-center justify-center gap-2 rounded-control text-body font-semibold whitespace-nowrap select-none transition-[filter,background-color] duration-(--duration-press) data-disabled:pointer-events-none data-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        glass: "glass hover:brightness-105",
        tinted: "glass-tinted hover:brightness-110",
        destructive: "glass-tinted glass-tint-destructive text-destructive-foreground hover:brightness-110",
        plain: "text-primary hover:bg-foreground/6",
      },
      size: {
        sm: "h-8 px-3.5 pointer-coarse:h-10",
        default: "h-10 px-5 pointer-coarse:h-11",
        lg: "h-12 px-6 text-headline pointer-coarse:h-13",
        "icon-sm": "size-8 pointer-coarse:size-10",
        icon: "size-10 pointer-coarse:size-11",
        "icon-lg": "size-12 pointer-coarse:size-13",
      },
    },
    defaultVariants: { variant: "glass", size: "default" },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant ?? "glass"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
