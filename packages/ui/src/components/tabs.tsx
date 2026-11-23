import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@perpix/ui/lib/utils";

function Tabs(props: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "group/tabs-list relative inline-flex h-11 items-center justify-center gap-1 rounded-control glass p-1 text-muted-foreground pointer-coarse:h-12",
        className,
      )}
      {...props}
    />
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "border-glass-edge-light absolute z-0 rounded-control border bg-card/90 shadow-raised transition-all duration-300 ease-out",
        "top-[var(--active-tab-top)] left-[var(--active-tab-left)] h-[var(--active-tab-height)] w-[var(--active-tab-width)]",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex pressable items-center justify-center rounded-control px-4 py-1.5 text-body font-medium whitespace-nowrap text-muted-foreground focus-ring transition-all duration-150 outline-none hover:text-foreground disabled:pointer-events-none disabled:opacity-50 pointer-coarse:min-h-10 pointer-coarse:px-5",
        "data-active:font-semibold data-active:text-foreground",
        "data-active:border-glass-edge-light data-active:border data-active:bg-card/90 data-active:shadow-raised",
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
      className={cn("mt-inset motion-pop focus-ring outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
