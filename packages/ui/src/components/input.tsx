import type { ComponentProps } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@perpix/ui/lib/utils";

type InputProps = ComponentProps<typeof InputPrimitive>;

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      type={type}
      className={cn(
        "flex h-10 w-full rounded-control border border-glass-edge-light bg-card/50 px-3.5 py-2 text-body text-foreground focus-ring backdrop-blur-md transition-all duration-150 outline-none placeholder:text-muted-foreground/75 focus:bg-card/80 disabled:cursor-not-allowed disabled:opacity-45 pointer-coarse:h-11 pointer-coarse:text-base",
        className,
      )}
      {...props}
    />
  );
}

export { Input, type InputProps };
