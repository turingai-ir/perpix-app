import { useState, type ComponentProps, type ReactNode } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { XCircleIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";
import { triggerHaptic } from "@perpix/ui/lib/haptic";

type InputProps = ComponentProps<typeof InputPrimitive> & {
  /** Optional icon or element placed at the inline start of the input */
  startIcon?: ReactNode;
  /** Optional icon or element placed at the inline end of the input */
  endIcon?: ReactNode;
  /** Whether to show a clear button when text is present or when onClear is supplied */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Whether to show password reveal eye toggle when type="password". Defaults to true. */
  showPasswordToggle?: boolean;
  /** Whether the input is in an invalid/error state */
  error?: boolean;
  /** Optional error message displayed beneath the input */
  errorText?: string;
  /** Optional neutral helper guidance text displayed beneath the input when there is no error */
  helperText?: string;
};

function Input({
  className,
  type = "text",
  startIcon,
  endIcon,
  clearable,
  onClear,
  showPasswordToggle = true,
  error = false,
  errorText,
  helperText,
  value,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasStart = Boolean(startIcon);
  const showClear = Boolean(
    clearable && (value !== undefined ? String(value).length > 0 : true),
  );
  const hasPasswordToggle = isPassword && showPasswordToggle && !endIcon;
  const hasEnd = Boolean(endIcon || showClear || hasPasswordToggle);

  const inputElement = (
    <InputPrimitive
      data-slot="input"
      data-invalid={error ? "" : undefined}
      aria-invalid={error ? true : undefined}
      type={effectiveType}
      value={value}
      className={cn(
        "flex h-10 w-full rounded-control border bg-card/50 px-3.5 py-2 text-body text-foreground focus-ring backdrop-blur-md transition-all duration-150 outline-none placeholder:text-muted-foreground/75 focus:bg-card/80 disabled:cursor-not-allowed disabled:opacity-45 pointer-coarse:h-11 pointer-coarse:text-base",
        error
          ? "border-destructive/80 text-destructive placeholder:text-destructive/50 focus:border-destructive"
          : "border-glass-edge-light",
        hasStart && "ps-10",
        hasEnd && "pe-10",
        className,
      )}
      {...props}
    />
  );

  const content =
    !hasStart && !hasEnd ? (
      inputElement
    ) : (
      <div className="relative isolate flex w-full items-center">
        {hasStart ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute start-3.5 flex items-center justify-center [&_svg]:size-4.5",
              error ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {startIcon}
          </span>
        ) : null}

        {inputElement}

        {showClear ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label="پاک کردن"
            onClick={() => {
              triggerHaptic("selection");
              onClear?.();
            }}
            className="pressable absolute end-3 flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-ring outline-none relative pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px]"
          >
            <XCircleIcon weight="fill" className="size-4.5" />
          </button>
        ) : hasPasswordToggle ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            onClick={() => {
              triggerHaptic("selection");
              setShowPassword((prev) => !prev);
            }}
            className="pressable absolute end-3 flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-ring outline-none relative pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px]"
          >
            {showPassword ? (
              <EyeSlashIcon className="size-4.5" />
            ) : (
              <EyeIcon className="size-4.5" />
            )}
          </button>
        ) : endIcon ? (
          <span className="absolute end-3 flex items-center justify-center text-muted-foreground [&_svg]:size-4.5">
            {endIcon}
          </span>
        ) : null}
      </div>
    );

  if (errorText || helperText) {
    return (
      <div className="flex w-full flex-col gap-1">
        {content}
        {errorText ? (
          <span className="text-caption font-medium text-destructive ps-1">
            {errorText}
          </span>
        ) : helperText ? (
          <span className="text-caption text-muted-foreground ps-1">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }

  return content;
}

export { Input, type InputProps };
