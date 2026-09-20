import type { ReactNode } from "react";
import styles from "../dashboard.module.css";

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
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <p className={styles.metricLabel}>{label}</p>
      {children}
    </div>
  );
}
