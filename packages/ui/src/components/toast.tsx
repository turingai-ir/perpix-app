import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";

const useToastManager = ToastPrimitive.useToastManager;

function ToastProvider(props: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />;
}

function ToastPortal(props: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed bottom-0 z-[100] flex max-h-dvh w-full flex-col-reverse gap-2 p-4 sm:end-0 sm:max-w-md",
        className,
      )}
      {...props}
    />
  );
}

type ToastProps = Omit<ToastPrimitive.Root.Props, "toast"> & {
  toast?: ToastPrimitive.Root.Props["toast"];
};

function Toast({ className, toast, ...props }: ToastProps) {
  const resolvedToast: ToastPrimitive.Root.Props["toast"] = toast ?? {
    id: "toast-standalone",
  };

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      toast={resolvedToast}
      className={cn(
        "pointer-events-auto relative flex w-full motion-pop items-center justify-between gap-3 overflow-hidden rounded-overlay glass p-inset-sm shadow-modal outline-none",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-headline font-semibold", className)}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-body text-muted-foreground", className)}
      {...props}
    />
  );
}

function ToastClose({ className, ...props }: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "rounded-control p-1 text-muted-foreground focus-ring transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    >
      <XIcon aria-hidden className="size-4" />
    </ToastPrimitive.Close>
  );
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToastManager,
};
