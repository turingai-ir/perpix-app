import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableUuidProps {
  value: string;
  /** Show the whole UUID; by default it is shortened to `xxxxxxxx…xxxx`. */
  full?: boolean;
  className?: string;
}

/** A UUID in monospace with a button that copies it; the full value is always in the tooltip. */
export function CopyableUuid({
  value,
  full = false,
  className,
}: CopyableUuidProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    void navigator.clipboard.writeText(value).then(() => setCopied(true));
  };

  return (
    <span
      dir="ltr"
      className={cn(
        "text-muted-foreground inline-flex items-center gap-1 font-mono text-[11px]",
        className,
      )}
    >
      <span title={value} className="select-all">
        {full ? value : `${value.slice(0, 8)}…${value.slice(-4)}`}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label="کپی شناسه"
        title="کپی شناسه"
        className="hover:text-foreground hover:bg-muted rounded p-0.5 transition-colors"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </span>
  );
}
