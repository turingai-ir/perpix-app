import { useRef, type ComponentProps, type RefObject } from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { Button } from "@perpix/ui/components/button";
import { useSheetDrag } from "@perpix/ui/hooks/use-sheet-drag";

/* Sheet = a Base UI dialog that slides from an edge. `bottom` is the mobile default. */
type SheetSide = "bottom" | "top" | "inline-start" | "inline-end";

const sideClasses: Record<SheetSide, string> = {
  bottom:
    "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-panel pb-[max(env(safe-area-inset-bottom),1.5rem)]",
  top: "inset-x-0 top-0 max-h-[92dvh] rounded-b-panel pt-[max(env(safe-area-inset-top),1.5rem)]",
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
function SheetGrabber({
  sheetRef,
}: {
  sheetRef: RefObject<HTMLDivElement | null>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const handlers = useSheetDrag(sheetRef, () => closeRef.current?.click());
  return (
    <div
      aria-hidden
      className="-mx-inset-lg -mt-inset-lg flex shrink-0 cursor-grab touch-none items-center justify-center pt-3.5 pb-2.5 active:cursor-grabbing pointer-coarse:min-h-11"
      {...handlers}
    >
      <span className="h-1.5 w-11 rounded-full bg-foreground/25 transition-colors group-active:bg-foreground/45" />
      <SheetPrimitive.Close ref={closeRef} hidden tabIndex={-1} />
    </div>
  );
}

function SheetContent({
  className,
  children,
  side = "bottom",
  closeLabel,
  ...props
}: SheetContentProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 glass-scrim motion-fade"
      />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        ref={sheetRef}
        className={cn(
          "fixed isolate z-50 flex motion-sheet flex-col gap-block overflow-y-auto has-([data-slot=sheet-body]):overflow-hidden overscroll-contain glass p-inset-lg outline-none",
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
            render={
              <Button
                variant="glass"
                size="icon-sm"
                className="absolute end-4 top-4"
              />
            }
          >
            <XIcon aria-hidden />
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-group pe-8", className)}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex-1 overflow-y-auto overscroll-contain no-scrollbar -mx-inset-lg px-inset-lg py-1",
        className,
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-group pt-2", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-title-3 font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-body text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
};
