import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { triggerHaptic } from "@perpix/ui/lib/haptic";

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  /** Visual error state. Sets border to destructive. */
  error?: boolean;
  /** Whether to trigger tactile haptic vibration on toggle. Defaults to true. */
  haptic?: boolean;
};

function Checkbox({
  className,
  error = false,
  haptic = true,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-error={error ? "" : undefined}
      onCheckedChange={(checked, event) => {
        if (haptic) triggerHaptic("selection");
        onCheckedChange?.(checked, event);
      }}
      className={cn(
        "peer relative inline-flex size-5 shrink-0 pressable items-center justify-center rounded-control border border-glass-edge-light bg-card/60 focus-ring backdrop-blur-md transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:size-6 pointer-coarse:before:absolute pointer-coarse:before:-inset-2.5 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px] pointer-coarse:before:content-['']",
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-[0_0_10px_-2px_var(--primary)]",
        "data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground data-indeterminate:shadow-[0_0_10px_-2px_var(--primary)]",
        error && "border-destructive focus-ring-destructive",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex motion-pop items-center justify-center text-current"
      >
        <CheckIcon
          weight="bold"
          aria-hidden="true"
          className="size-3.5 pointer-coarse:size-4 [[data-indeterminate]_&]:hidden"
        />
        <MinusIcon
          weight="bold"
          aria-hidden="true"
          className="hidden size-3.5 pointer-coarse:size-4 [[data-indeterminate]_&]:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, type CheckboxProps };
