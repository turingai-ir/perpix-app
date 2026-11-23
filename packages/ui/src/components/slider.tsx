import { useEffect, useState } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider";
import { cn } from "@perpix/ui/lib/utils";

type SliderProps = SliderPrimitive.Root.Props & {
  /** Optional direction override; defaults to DirectionProvider context or document direction */
  dir?: "ltr" | "rtl";
};

function SliderInner({ className, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center py-2 select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className="relative flex w-full items-center"
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-2 w-full grow overflow-hidden rounded-full glass pointer-coarse:h-2.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-indicator"
            className="h-full rounded-full bg-primary"
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          className="block size-5 pressable cursor-grab rounded-full border border-white/60 bg-white shadow-raised focus-ring transition-transform hover:scale-105 active:cursor-grabbing pointer-coarse:size-7"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

function Slider({ dir, ...props }: SliderProps) {
  const contextDir = useDirection();
  const [docDir, setDocDir] = useState<"ltr" | "rtl">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.dir === "ltr" ? "ltr" : "rtl";
    }
    return "rtl";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const update = () => {
      const current = document.documentElement.dir === "ltr" ? "ltr" : "rtl";
      setDocDir(current);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);

  const effectiveDir = dir ?? (contextDir || docDir);

  if (effectiveDir && effectiveDir !== contextDir) {
    return (
      <DirectionProvider direction={effectiveDir}>
        <SliderInner {...props} />
      </DirectionProvider>
    );
  }

  return <SliderInner {...props} />;
}

export { Slider, type SliderProps };
