import { useRef, type CSSProperties } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { useDirection } from "@base-ui/react/direction-provider";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { triggerHaptic } from "@perpix/ui/lib/haptic";
import { useDragScroll } from "@perpix/ui/hooks/use-drag-scroll";

function Tabs(props: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

type TabsListProps = TabsPrimitive.List.Props & {
  /**
   * Whether to automatically render the sliding pill indicator.
   * Defaults to `true` for authentic Apple HIG smooth sliding.
   */
  indicator?: boolean;
  /**
   * Whether to enable horizontal momentum and drag scrolling when tabs exceed parent width.
   * When true, hides scrollbars, enables desktop mouse drag-to-scroll, and displays Liquid Glass edge fade cues.
   */
  scrollable?: boolean;
  /**
   * Whether to render floating glass scroll arrows at the edges on desktop when content overflows.
   * Defaults to `true`.
   */
  showArrows?: boolean;
};

/**
 * Calculates edge fade mask in physical screen coordinates.
 * - In RTL: Start is on the RIGHT; End is on the LEFT.
 * - In LTR: Start is on the LEFT; End is on the RIGHT.
 */
function getMaskImage(
  canScrollStart: boolean,
  canScrollEnd: boolean,
  isRtl: boolean,
): string | undefined {
  if (canScrollStart && canScrollEnd) {
    return "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)";
  }
  const fadeLeft = isRtl ? canScrollEnd : canScrollStart;
  const fadeRight = isRtl ? canScrollStart : canScrollEnd;

  if (fadeLeft) {
    return "linear-gradient(to right, transparent 0, black 32px, black 100%)";
  }
  if (fadeRight) {
    return "linear-gradient(to left, transparent 0, black 32px, black 100%)";
  }
  return undefined;
}

function TabsList({
  className,
  children,
  indicator = true,
  scrollable = false,
  showArrows = true,
  style,
  ...props
}: TabsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const contextDirection = useDirection();
  const {
    canScrollStart,
    canScrollEnd,
    isDragging,
    isRtl: hookIsRtl,
    scrollStart,
    scrollEnd,
    containerProps,
  } = useDragScroll(listRef);

  // Synchronously resolve RTL from Base UI context or hook
  const isRtl = contextDirection === "rtl" || hookIsRtl;

  if (!scrollable) {
    return (
      <TabsPrimitive.List
        data-slot="tabs-list"
        style={style}
        className={cn(
          "group/tabs-list relative inline-flex h-11 items-center justify-center gap-1 rounded-full border border-glass-edge-light/60 bg-muted/50 p-1 text-muted-foreground shadow-xs backdrop-blur-xl pointer-coarse:h-12",
          className,
        )}
        {...props}
      >
        {indicator && <TabsIndicator />}
        {children}
      </TabsPrimitive.List>
    );
  }

  const maskImage = getMaskImage(canScrollStart, canScrollEnd, isRtl);
  const maskStyle: CSSProperties | undefined = maskImage
    ? {
        WebkitMaskImage: maskImage,
        maskImage,
      }
    : undefined;

  return (
    <div
      data-slot="tabs-scroll-wrapper"
      className="group/tabs-wrapper relative flex w-full max-w-full items-center"
    >
      {/* Floating glass scroll arrow (Start / Previous) */}
      {showArrows && canScrollStart ? (
        <button
          type="button"
          aria-label="تب‌های قبلی"
          onClick={scrollStart}
          className="absolute start-1 z-20 flex size-7 items-center justify-center rounded-full glass shadow-raised text-foreground transition-all duration-150 hover:scale-110 active:scale-95 focus-ring pointer-coarse:hidden"
        >
          <CaretLeftIcon className="rtl:rotate-180 size-3.5" weight="bold" />
        </button>
      ) : null}

      <TabsPrimitive.List
        ref={listRef}
        data-slot="tabs-list"
        data-scrollable=""
        data-dragging={isDragging ? "" : undefined}
        data-scroll-start={canScrollStart ? "" : undefined}
        data-scroll-end={canScrollEnd ? "" : undefined}
        style={{ ...maskStyle, ...style }}
        className={cn(
          "group/tabs-list relative flex h-11 w-full max-w-full items-center justify-start gap-1 overflow-x-auto rounded-full border border-glass-edge-light/60 bg-muted/50 p-1 text-muted-foreground shadow-xs backdrop-blur-xl pointer-coarse:h-12",
          "no-scrollbar scroll-snap-x overscroll-x-contain select-none cursor-grab active:cursor-grabbing",
          isDragging && "snap-none scroll-auto",
          className,
        )}
        {...containerProps}
        {...props}
      >
        {indicator && <TabsIndicator />}
        {children}
      </TabsPrimitive.List>

      {/* Floating glass scroll arrow (End / Next) */}
      {showArrows && canScrollEnd ? (
        <button
          type="button"
          aria-label="تب‌های بعدی"
          onClick={scrollEnd}
          className="absolute end-1 z-20 flex size-7 items-center justify-center rounded-full glass shadow-raised text-foreground transition-all duration-150 hover:scale-110 active:scale-95 focus-ring pointer-coarse:hidden"
        >
          <CaretRightIcon className="rtl:rotate-180 size-3.5" weight="bold" />
        </button>
      ) : null}
    </div>
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute z-0 rounded-full border border-glass-edge-light bg-card/95 shadow-raised backdrop-blur-md transition-all duration-300 ease-out",
        "top-[var(--active-tab-top)] left-[var(--active-tab-left)] h-[var(--active-tab-height)] w-[var(--active-tab-width)]",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, onClick, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      onClick={(event) => {
        triggerHaptic("selection");
        // Center the active tab in view if inside a scrollable track
        const target = event.currentTarget;
        target.scrollIntoView?.({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
        onClick?.(event);
      }}
      className={cn(
        "relative z-10 inline-flex shrink-0 scroll-snap-center pressable items-center justify-center rounded-full border border-transparent px-4 py-1.5 text-body font-medium whitespace-nowrap text-muted-foreground focus-ring transition-colors duration-150 outline-none hover:text-foreground disabled:pointer-events-none disabled:opacity-50 pointer-coarse:min-h-11 pointer-coarse:px-5",
        "group-data-[dragging]/tabs-list:active:scale-100 group-data-[dragging]/tabs-list:cursor-grabbing",
        "data-active:font-semibold data-active:text-foreground",
        "data-active:border-glass-edge-light data-active:bg-card/95 data-active:shadow-raised",
        "group-has-[[data-slot=tabs-indicator]]/tabs-list:data-active:border-transparent group-has-[[data-slot=tabs-indicator]]/tabs-list:data-active:bg-transparent group-has-[[data-slot=tabs-indicator]]/tabs-list:data-active:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "mt-inset focus-ring transition-opacity duration-150 ease-out outline-none data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  type TabsListProps,
};
