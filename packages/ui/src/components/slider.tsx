import { useEffect, useState } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider";
import { cn } from "@perpix/ui/lib/utils";
import { triggerHaptic } from "@perpix/ui/lib/haptic";

type SliderProps = SliderPrimitive.Root.Props & {
  /** Optional direction override; defaults to DirectionProvider context or document direction */
  dir?: "ltr" | "rtl";
  /** Whether to render a floating bubble with current value above the thumb */
  showValueBubble?: boolean;
  /** Custom formatter for the value shown in the bubble */
  formatValue?: (value: number) => string;
};

type SliderInnerProps = SliderPrimitive.Root.Props & {
  showValueBubble?: boolean;
  formatValue?: (value: number) => string;
};

function SliderInner({
  className,
  showValueBubble = false,
  formatValue,
  onValueChange,
  value,
  defaultValue,
  ...props
}: SliderInnerProps) {
  const [internalValue, setInternalValue] = useState<number | readonly number[]>(
    () => value ?? defaultValue ?? 0,
  );

  const activeValue = value !== undefined ? value : internalValue;
  const numVal =
    typeof activeValue === "number"
      ? activeValue
      : Array.isArray(activeValue)
        ? (activeValue[0] ?? 0)
        : 0;
  const bubbleText = formatValue ? formatValue(numVal) : String(numVal);

  const handleValueChange: SliderPrimitive.Root.Props["onValueChange"] = (
    val,
    event,
  ) => {
    setInternalValue(val);
    triggerHaptic("selection");
    onValueChange?.(val, event);
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
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
          className="relative block size-5 pressable cursor-grab rounded-full border border-white/60 bg-white shadow-raised focus-ring transition-transform hover:scale-105 active:cursor-grabbing pointer-coarse:size-7 pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px] pointer-coarse:before:content-['']"
        >
          {showValueBubble ? (
            <span
              aria-hidden="true"
              className="absolute -top-7.5 left-1/2 -translate-x-1/2 pointer-events-none rounded-full glass px-2 py-0.5 text-caption font-semibold text-foreground shadow-raised motion-pop whitespace-nowrap transition-opacity duration-150"
            >
              {bubbleText}
            </span>
          ) : null}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

function Slider({ dir, showValueBubble, formatValue, ...props }: SliderProps) {
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
        <SliderInner
          showValueBubble={showValueBubble}
          formatValue={formatValue}
          {...props}
        />
      </DirectionProvider>
    );
  }

  return (
    <SliderInner
      showValueBubble={showValueBubble}
      formatValue={formatValue}
      {...props}
    />
  );
}

export { Slider, type SliderProps };
