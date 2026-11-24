import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { Button } from "@perpix/ui/components/button";

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 glass-scrim motion-fade", className)}
      {...props}
    />
  );
}

type DialogSize = "sm" | "default" | "lg" | "xl" | "full";

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  default: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] sm:max-w-3xl",
};

type DialogContentProps = DialogPrimitive.Popup.Props & {
  /** Accessible, localized label for the corner close button; omit to hide the button. */
  closeLabel?: string;
  /** Max-width size profile for the modal. Defaults to "sm". */
  size?: DialogSize;
};

function DialogContent({
  className,
  children,
  closeLabel,
  size = "sm",
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 isolate z-50 flex flex-col max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2rem)] motion-pop -translate-x-1/2 -translate-y-1/2 gap-section overflow-y-auto has-([data-slot=dialog-body]):overflow-hidden overscroll-contain rounded-panel glass p-inset-lg outline-none",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
        {closeLabel ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label={closeLabel}
            render={
              <Button
                variant="glass"
                size="icon-sm"
                className="absolute end-3 top-3 pointer-coarse:end-2 pointer-coarse:top-2"
              />
            }
          >
            <XIcon aria-hidden />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex shrink-0 flex-col gap-group pe-8", className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "flex-1 overflow-y-auto overscroll-contain no-scrollbar -mx-inset-lg px-inset-lg py-1",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex shrink-0 flex-col gap-group pt-2 *:w-full", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-title-3 font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-body text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
  type DialogSize,
};
