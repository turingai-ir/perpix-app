import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

type FinanceSummaryItem = {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  tone: "positive" | "neutral" | "negative";
};

export function FinanceSummary({ items }: { items: FinanceSummaryItem[] }) {
  return (
    <section className="finance-summary" aria-label={items[0]?.label}>
      {items.map(({ label, value, unit, icon: Icon, tone }, index) => (
        <article
          key={label}
          className={`finance-summary-card finance-summary-${tone}`}
          style={{ "--finance-order": index } as CSSProperties}
        >
          <span className="finance-summary-icon" aria-hidden="true">
            <Icon />
          </span>
          <span className="finance-summary-copy">
            <span>{label}</span>
            <strong>
              <bdi>{value}</bdi>
              {unit ? <small> {unit}</small> : null}
            </strong>
          </span>
        </article>
      ))}
    </section>
  );
}
