import { cn } from "@/lib/utils";
import { parseJsonObject } from "../model/json-object";

interface JsonObjectFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

/** Textarea for a JSON object with live validation; the parent reads the same text to submit. */
export function JsonObjectField({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 8,
}: JsonObjectFieldProps) {
  const parsed = parseJsonObject(value);
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold text-foreground"
      >
        {label}
      </label>
      <textarea
        id={id}
        dir="ltr"
        spellCheck={false}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!parsed.ok}
        className={cn(
          "w-full rounded-lg border border-input bg-card px-3 py-2 font-mono text-xs text-foreground shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          !parsed.ok && "border-destructive",
        )}
      />
      {!parsed.ok ? (
        <span className="mt-1 block text-[11px] text-destructive" dir="ltr">
          {parsed.error}
        </span>
      ) : (
        hint && (
          <span className="mt-1 block text-[11px] text-muted-foreground">
            {hint}
          </span>
        )
      )}
    </div>
  );
}
