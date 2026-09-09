import type { ReactNode } from "react";

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
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
      <div className="mb-5">{icon}</div>
      <p className="text-xs text-zinc-500">{label}</p>
      {children}
    </div>
  );
}
