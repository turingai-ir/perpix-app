import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const TONE_ICON_CLASS = {
  positive: "",
  negative: "bg-destructive/12 text-destructive",
  neutral: "bg-warning/12 text-warning",
} as const;

type FinanceSummaryItem = {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  tone: "positive" | "neutral" | "negative";
};

export function FinanceSummary({ items }: { items: FinanceSummaryItem[] }) {
  return (
    <section
      className="relative z-3 mt-3.5 grid gap-3 sm:-mt-7 sm:grid-cols-3 sm:px-6"
      aria-label={items[0]?.label}
    >
      {items.map(({ label, value, unit, icon: Icon, tone }, index) => (
        <article
          key={label}
          className="animate-finance-rise bg-card/86 not-supports-[backdrop-filter:blur(1px)]:bg-card flex min-h-22 min-w-0 items-center gap-3.5 rounded-[1.25rem] p-4 shadow-[0_18px_45px_-34px_rgb(20_12_38/70%),inset_0_1px_rgb(255_255_255/35%)] outline outline-[color-mix(in_oklab,var(--border)_72%,transparent)] backdrop-blur-xl backdrop-saturate-[118%] [animation-delay:calc((var(--finance-order)+1)*70ms)] motion-reduce:animate-none contrast-more:outline-2 sm:min-h-25"
          style={{ "--finance-order": index } as CSSProperties}
        >
          <span
            className={cn(
              "grid size-11 flex-none place-items-center rounded-[0.95rem] bg-(--finance-accent-soft) text-(--finance-accent) [&_svg]:size-5",
              TONE_ICON_CLASS[tone],
            )}
            aria-hidden="true"
          >
            <Icon />
          </span>
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="text-muted-foreground text-xs">{label}</span>
            <strong className="flex min-w-0 items-baseline gap-1.5 text-xl tabular-nums">
              <bdi className="wrap-anywhere">{value}</bdi>
              {unit ? (
                <small className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                  {" "}
                  {unit}
                </small>
              ) : null}
            </strong>
          </span>
        </article>
      ))}
    </section>
  );
}
