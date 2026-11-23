import { useRef, type ComponentProps, type RefObject } from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { Button } from "@perpix/ui/components/button";
import { useSheetDrag } from "@perpix/ui/hooks/use-sheet-drag";

/* Sheet = a Base UI dialog that slides from an edge. `bottom` is the mobile default. */
type SheetSide = "bottom" | "top" | "inline-start" | "inline-end";

const sideClasses: Record<SheetSide, string> = {
  bottom: "inset-x-0 bottom-0 max-h-[90svh] rounded-t-panel pb-[max(env(safe-area-inset-bottom),1.5rem)]",
  top: "inset-x-0 top-0 max-h-[90svh] rounded-b-panel pt-[max(env(safe-area-inset-top),1.5rem)]",
  "inline-start": "inset-y-0 start-0 w-[min(85vw,24rem)] rounded-e-panel",
  "inline-end": "inset-y-0 end-0 w-[min(85vw,24rem)] rounded-s-panel",
};

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

type SheetContentProps = SheetPrimitive.Popup.Props & {
  side?: SheetSide;
  /** Accessible, localized label for the corner close button; omit to hide the button. */
  closeLabel?: string;
};

/* Grab handle of a bottom sheet: swipe down to dismiss (touch-action none keeps the page still). */
function SheetGrabber({ sheetRef }: { sheetRef: RefObject<HTMLDivElement | null> }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const handlers = useSheetDrag(sheetRef, () => closeRef.current?.click());
  return (
    <div aria-hidden className="-mx-inset-lg -mt-inset-lg flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-2" {...handlers}>
      <span className="h-1.5 w-10 rounded-full bg-foreground/25" />
      <SheetPrimitive.Close ref={closeRef} hidden tabIndex={-1} />
    </div>
  );
}

function SheetContent({ className, children, side = "bottom", closeLabel, ...props }: SheetContentProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop data-slot="sheet-overlay" className="glass-scrim motion-fade fixed inset-0 z-50" />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        ref={sheetRef}
        className={cn(
          "glass motion-sheet fixed z-50 flex flex-col gap-block overflow-y-auto overscroll-contain p-inset-lg outline-none",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {side === "bottom" ? <SheetGrabber sheetRef={sheetRef} /> : null}
        {children}
        {closeLabel ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            aria-label={closeLabel}
            render={<Button variant="glass" size="icon-sm" className="absolute end-4 top-4" />}
          >
            <XIcon aria-hidden />
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-group pe-8", className)} {...props} />;
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-group", className)} {...props} />;
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-title-3 font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-body text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, type SheetSide };
