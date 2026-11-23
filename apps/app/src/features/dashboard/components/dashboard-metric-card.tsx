import type { ReactNode } from "react";
import { METRIC_CARD_CLASS } from "../model/dashboard-styles";

interface DashboardMetricCardProps {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}

export function DashboardMetricCard({
  children,
  icon,
  label,
}: DashboardMetricCardProps) {
  return (
    <div className={METRIC_CARD_CLASS}>
      <div className="mb-5 grid size-10.5 place-items-center rounded-lg border border-foreground/8 bg-foreground/4 inset-shadow-highlight-sm">
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
