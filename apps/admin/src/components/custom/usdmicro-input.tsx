import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { persianNumbersToEnglish } from "@/utils/number";

const groupFormatter = new Intl.NumberFormat("en-US", { useGrouping: true });

/** `"1234567"` → `"1,234,567"`; leading zeros are dropped, `""` stays empty. */
const groupDigits = (digits: string): string =>
  digits === "" ? "" : groupFormatter.format(BigInt(digits));

const countDigits = (text: string): number => text.replace(/\D/g, "").length;

interface UsdmicroInputProps extends Omit<
  InputProps,
  "value" | "onChange" | "type" | "inputMode"
> {
  /** The amount as plain digits, e.g. `"1000000"`. */
  value: string;
  /** Receives plain digits (Persian/Arabic digits converted, separators removed). */
  onValueChange: (digits: string) => void;
}

/**
 * A micro-dollar input that groups digits by three while typing
 * (`1,000,000`) and keeps the caret next to the digit it was beside.
 */
export const UsdmicroInput = forwardRef<HTMLInputElement, UsdmicroInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    /** Digits left of the caret after the last edit, restored after re-render. */
    const caretDigits = useRef<number | null>(null);

    const display = groupDigits(value);

    useLayoutEffect(() => {
      const input = inputRef.current;
      const wanted = caretDigits.current;
      if (!input || wanted === null || document.activeElement !== input) return;
      caretDigits.current = null;
      let position = 0;
      let seen = 0;
      while (position < display.length && seen < wanted) {
        if (/\d/.test(display[position] ?? "")) seen += 1;
        position += 1;
      }
      input.setSelectionRange(position, position);
    }, [display]);

    return (
      <Input
        {...props}
        ref={inputRef}
        type="text"
        dir="ltr"
        inputMode="numeric"
        autoComplete="off"
        className={cn("text-left font-mono tabular-nums", className)}
        value={display}
        onChange={(e) => {
          const raw = persianNumbersToEnglish(e.target.value);
          const caret = e.target.selectionStart ?? raw.length;
          caretDigits.current = countDigits(raw.slice(0, caret));
          const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
          if (digits.length > 16) return; // beyond Number.MAX_SAFE_INTEGER
          onValueChange(digits);
        }}
      />
    );
  },
);
UsdmicroInput.displayName = "UsdmicroInput";
