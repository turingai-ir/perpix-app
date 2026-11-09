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
      <div className="border-foreground/8 bg-foreground/4 mb-5 grid size-10.5 place-items-center rounded-[0.8rem] border shadow-[inset_0_1px_rgb(255_255_255/7%)]">
        {icon}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
      {children}
    </div>
  );
}
