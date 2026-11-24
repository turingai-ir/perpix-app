import { useState, type ReactNode } from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  XIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningCircleIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { triggerHaptic } from "@perpix/ui/lib/haptic";

const useToastManager = ToastPrimitive.useToastManager;
const createToastManager = ToastPrimitive.createToastManager;

/**
 * Global toast manager instance for imperative toast calls outside or inside React.
 */
const globalToastManager = createToastManager();

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

type ToastActionOption = {
  label: string;
  onClick: () => void;
};

type ToastOptions = {
  description?: ReactNode;
  variant?: ToastVariant;
  /** Auto-remove timeout in milliseconds. Set to 0 to disable auto-dismiss. Defaults to 5000. */
  duration?: number;
  action?: ToastActionOption;
  onClose?: () => void;
};

/**
 * Imperative toast function to trigger notifications from anywhere.
 *
 * @example
 * toast("تغییرات ذخیره شد");
 * toast.success("عملیات با موفقیت انجام شد", { description: "فایل ویدیویی آماده است" });
 * toast.error("خطا در برقراری ارتباط");
 * toast.promise(saveData(), { loading: "در حال ذخیره...", success: "ذخیره شد", error: "خطا رخ داد" });
 */
const toast = (title: ReactNode, options?: ToastOptions) => {
  const variant = options?.variant ?? "default";
  triggerHaptic(variant === "destructive" ? "medium" : "light");
  return globalToastManager.add({
    title,
    description: options?.description,
    timeout: options?.duration !== undefined ? options.duration : 5000,
    onClose: options?.onClose,
    data: {
      variant,
      action: options?.action,
    },
  });
};

toast.success = (title: ReactNode, options?: Omit<ToastOptions, "variant">) =>
  toast(title, { ...options, variant: "success" });

toast.error = (title: ReactNode, options?: Omit<ToastOptions, "variant">) =>
  toast(title, { ...options, variant: "destructive" });

toast.warning = (title: ReactNode, options?: Omit<ToastOptions, "variant">) =>
  toast(title, { ...options, variant: "warning" });

toast.info = (title: ReactNode, options?: Omit<ToastOptions, "variant">) =>
  toast(title, { ...options, variant: "info" });

toast.dismiss = (id?: string) => globalToastManager.close(id);

toast.promise = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: ReactNode;
    success: ReactNode | ((data: T) => ReactNode);
    error: ReactNode | ((err: unknown) => ReactNode);
  },
  options?: Omit<ToastOptions, "variant">,
): Promise<T> => {
  const id = toast(messages.loading, {
    ...options,
    variant: "info",
    duration: 0,
  });
  try {
    const data = await promise;
    const successTitle =
      typeof messages.success === "function"
        ? messages.success(data)
        : messages.success;
    globalToastManager.update(id, {
      title: successTitle,
      timeout: options?.duration !== undefined ? options.duration : 5000,
      data: { variant: "success", action: options?.action },
    });
    return data;
  } catch (err) {
    const errorTitle =
      typeof messages.error === "function"
        ? messages.error(err)
        : messages.error;
    globalToastManager.update(id, {
      title: errorTitle,
      timeout: options?.duration !== undefined ? options.duration : 5000,
      data: { variant: "destructive", action: options?.action },
    });
    throw err;
  }
};

function ToastProvider({
  limit = 3,
  toastManager = globalToastManager,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastPrimitive.Provider
      data-slot="toast-provider"
      limit={limit}
      toastManager={toastManager}
      {...props}
    />
  );
}

function ToastPortal(props: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

type ToastViewportProps = ToastPrimitive.Viewport.Props & {
  /**
   * When true (default), collapses multiple toasts into an iOS-style stacked deck at the bottom.
   * Expands into a full list on hover, focus or click, saving up to 80% screen height.
   */
  stacked?: boolean;
};

function ToastViewport({
  className,
  stacked = true,
  ...props
}: ToastViewportProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      data-stacked={stacked ? "" : undefined}
      data-expanded={isExpanded ? "" : undefined}
      onMouseEnter={() => {
        if (stacked) setIsExpanded(true);
      }}
      onMouseLeave={() => {
        if (stacked) setIsExpanded(false);
      }}
      onClick={() => {
        if (stacked) setIsExpanded((prev) => !prev);
      }}
      className={cn(
        "group/toast-viewport pointer-events-none fixed bottom-0 z-[100] flex w-full flex-col-reverse p-4 gap-2.5 sm:end-0 sm:max-w-md has-[[data-slot=toast]]:pointer-events-auto",
        stacked
          ? cn(
              "h-20 hover:h-auto focus-within:h-auto data-[expanded]:h-auto transition-[height] duration-300",
              isExpanded && "h-auto",
            )
          : "max-h-dvh",
        className,
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-overlay glass p-inset-sm shadow-modal outline-none transition-all duration-300 ease-[var(--ease-spring)] text-foreground data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-90 data-[ending-style]:translate-y-4",
  {
    variants: {
      variant: {
        default: "border-border/40",
        success:
          "glass-tinted text-foreground glass-tint-success border-success/35 bg-success/10 dark:bg-success/15",
        destructive:
          "glass-tinted text-foreground glass-tint-destructive border-destructive/35 bg-destructive/10 dark:bg-destructive/15",
        info: "glass-tinted text-foreground glass-tint-info border-info/35 bg-info/10 dark:bg-info/15",
        warning:
          "glass-tinted text-foreground glass-tint-warning border-warning/35 bg-warning/10 dark:bg-warning/15",
      },
      stacked: {
        true: [
          "absolute bottom-0 inset-x-0 mx-auto",
          "translate-y-[calc(var(--toast-index,0)*-10px)]",
          "scale-[calc(1-var(--toast-index,0)*0.05)]",
          "opacity-[calc(1-var(--toast-index,0)*0.22)]",
          "z-[calc(100-var(--toast-index,0))]",
          "data-limited:opacity-0 data-limited:pointer-events-none data-limited:scale-90",
          "group-hover/toast-viewport:relative group-hover/toast-viewport:translate-y-0 group-hover/toast-viewport:scale-100 group-hover/toast-viewport:opacity-100",
          "group-focus-within/toast-viewport:relative group-focus-within/toast-viewport:translate-y-0 group-focus-within/toast-viewport:scale-100 group-focus-within/toast-viewport:opacity-100",
          "group-data-[expanded]/toast-viewport:relative group-data-[expanded]/toast-viewport:translate-y-0 group-data-[expanded]/toast-viewport:scale-100 group-data-[expanded]/toast-viewport:opacity-100",
        ],
        false: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      stacked: true,
    },
  },
);

type ToastProps = Omit<ToastPrimitive.Root.Props, "toast"> &
  VariantProps<typeof toastVariants> & {
    toast?: ToastPrimitive.Root.Props["toast"];
  };

function Toast({ className, variant, stacked, toast, ...props }: ToastProps) {
  const resolvedToast: ToastPrimitive.Root.Props["toast"] = toast ?? {
    id: "toast-standalone",
  };

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant ?? "default"}
      toast={resolvedToast}
      className={cn(toastVariants({ variant, stacked }), className)}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-headline font-semibold text-foreground", className)}
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

function ToastClose({ className, onClick, ...props }: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cn(
        "pressable rounded-control p-1 text-muted-foreground focus-ring transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    >
      <XIcon aria-hidden className="size-4" />
    </ToastPrimitive.Close>
  );
}

function ToastAction({ className, onClick, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

type ToastProgressProps = {
  /** Duration of auto-remove timer in milliseconds. Defaults to 5000. */
  duration?: number;
  className?: string;
};

/**
 * Visual countdown progress bar indicating time remaining before auto-remove.
 * Pauses automatically when hovered or focused.
 */
function ToastProgress({ duration = 5000, className }: ToastProgressProps) {
  if (duration <= 0) return null;
  return (
    <div
      data-slot="toast-progress"
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-0 inset-x-0 h-0.5 bg-foreground/15 overflow-hidden",
        className,
      )}
    >
      <div
        className="size-full bg-primary/75 origin-start group-hover/toast-viewport:[animation-play-state:paused]"
        style={{
          animation: `toast-countdown ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

type ToasterProps = {
  /** When true (default), collapses multiple toasts into an iOS-style stacked deck at the bottom. */
  stacked?: boolean;
  /** Maximum visible toasts at once. Defaults to 4. */
  limit?: number;
  /** Default auto-remove timeout in milliseconds. Defaults to 5000. */
  timeout?: number;
  /** Whether to show a countdown progress bar on auto-dismissing toasts. Defaults to true. */
  showProgress?: boolean;
  className?: string;
};

function ToasterView({
  stacked = true,
  showProgress = true,
}: {
  stacked?: boolean;
  showProgress?: boolean;
}) {
  const manager = useToastManager();

  return (
    <ToastPortal>
      <ToastViewport stacked={stacked}>
        {manager.toasts.map((item) => {
          const data = item.data as
            | {
                variant?: ToastVariant;
                action?: ToastActionOption;
              }
            | undefined;
          const variant = data?.variant ?? (item.type as ToastVariant) ?? "default";
          const action = data?.action;
          const duration = item.timeout ?? 5000;

          return (
            <Toast key={item.id} toast={item} variant={variant} stacked={stacked}>
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                {variant === "success" ? (
                  <CheckCircleIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-success"
                  />
                ) : variant === "destructive" ? (
                  <XCircleIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-destructive"
                  />
                ) : variant === "warning" ? (
                  <WarningCircleIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-warning"
                  />
                ) : variant === "info" ? (
                  <InfoIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-primary"
                  />
                ) : null}

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <ToastTitle>{item.title}</ToastTitle>
                  {item.description ? (
                    <ToastDescription>{item.description}</ToastDescription>
                  ) : null}
                </div>
              </div>

              {action ? (
                <ToastAction
                  onClick={action.onClick}
                  className="px-2.5 py-1 text-caption font-semibold rounded-control glass hover:brightness-110 active:brightness-95"
                >
                  {action.label}
                </ToastAction>
              ) : null}

              <ToastClose />
              {showProgress && duration > 0 ? (
                <ToastProgress duration={duration} />
              ) : null}
            </Toast>
          );
        })}
      </ToastViewport>
    </ToastPortal>
  );
}

/**
 * Drop-in notification container to place in root layout.
 * Automatically renders toasts triggered via `toast()` with stacked deck, auto-remove, and icons.
 */
function Toaster({
  stacked = true,
  limit = 4,
  timeout = 5000,
  showProgress = true,
}: ToasterProps) {
  return (
    <ToastProvider
      toastManager={globalToastManager}
      limit={limit}
      timeout={timeout}
    >
      <ToasterView stacked={stacked} showProgress={showProgress} />
    </ToastProvider>
  );
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProgress,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  globalToastManager,
  toast,
  toastVariants,
  useToastManager,
  type ToastActionOption,
  type ToastOptions,
  type ToastProgressProps,
  type ToastProps,
  type ToastVariant,
  type ToastViewportProps,
  type ToasterProps,
};
