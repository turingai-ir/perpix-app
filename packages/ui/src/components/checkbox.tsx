import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";

type CheckboxProps = CheckboxPrimitive.Root.Props;

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-glass-edge-light inline-flex size-5 shrink-0 pressable items-center justify-center rounded-control border glass focus-ring transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:size-6 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-[0_0_10px_-2px_var(--primary)]",
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
          className="size-3.5 pointer-coarse:size-4"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, type CheckboxProps };
