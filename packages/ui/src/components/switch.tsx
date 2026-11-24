import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@perpix/ui/lib/utils";
import { triggerHaptic } from "@perpix/ui/lib/haptic";

type SwitchProps = SwitchPrimitive.Root.Props;

function Switch({ className, onCheckedChange, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      onCheckedChange={(checked, event) => {
        triggerHaptic("selection");
        onCheckedChange?.(checked, event);
      }}
      className={cn(
        "peer relative inline-flex h-6 w-11 shrink-0 pressable cursor-pointer items-center rounded-full glass p-0.5 focus-ring transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-7 pointer-coarse:w-13 pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px] pointer-coarse:before:content-[''] data-checked:border-primary/50 data-checked:bg-primary data-checked:shadow-[0_0_14px_-2px_var(--primary)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full border border-white/50 bg-white shadow-raised ring-0 transition-transform duration-200 ease-in-out pointer-coarse:size-6 data-checked:translate-x-5 rtl:data-checked:-translate-x-5 pointer-coarse:data-checked:translate-x-6 rtl:pointer-coarse:data-checked:-translate-x-6"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, type SwitchProps };
