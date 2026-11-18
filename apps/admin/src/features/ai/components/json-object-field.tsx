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
        className="text-foreground mb-1 block text-xs font-semibold"
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
          "border-input bg-card text-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border px-3 py-2 font-mono text-xs shadow-xs focus-visible:ring-3 focus-visible:outline-none",
          !parsed.ok && "border-destructive",
        )}
      />
      {!parsed.ok ? (
        <span className="text-destructive mt-1 block text-[11px]" dir="ltr">
          {parsed.error}
        </span>
      ) : (
        hint && (
          <span className="text-muted-foreground mt-1 block text-[11px]">
            {hint}
          </span>
        )
      )}
    </div>
  );
}
