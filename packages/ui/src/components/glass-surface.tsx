import type { ComponentProps } from "react";
import { cn } from "@perpix/ui/lib/utils";

/**
 * soft: Liquid Glass with a blurred, saturated backdrop (default).
 * flat: same fill, sheen and rim without backdrop filter. Use over playing video or a canvas being
 * dragged; inside a `data-canvas-busy` ancestor soft turns flat automatically.
 * Floating layers only (toolbar, panel over content); cards and lists stay solid.
 */
export type GlassIntensity = "soft" | "flat";

export type GlassSurfaceProps = ComponentProps<"div"> & {
  intensity?: GlassIntensity;
};

export function GlassSurface({
  intensity = "soft",
  className,
  ...props
}: GlassSurfaceProps) {
  return (
    <div
      data-slot="glass-surface"
      data-intensity={intensity}
      className={cn(
        "rounded-card",
        intensity === "soft" ? "glass" : "glass-flat",
        className,
      )}
      {...props}
    />
  );
}
