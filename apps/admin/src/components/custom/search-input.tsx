import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  debounceMs = 350,
  onClear,
  placeholder,
  className,
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);

  // Sync with outer value if it changes from outside
  if (prevValue !== value) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Debounced notification to parent
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, debounceMs]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    onClear?.();
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute right-3 size-4"
      />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pr-9 pl-8"
        {...props}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="پاک کردن جستجو"
          className="text-muted-foreground hover:text-foreground hover:bg-muted absolute left-2.5 rounded-full p-0.5 transition-colors focus:outline-none"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
