import type { ComponentType, ReactNode } from "react";

import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

import { FINANCE_STATUS_TONE_CLASS } from "./finance-styles";

type FinanceStatusProps = {
  tone: keyof typeof FINANCE_STATUS_TONE_CLASS;
  icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  children: ReactNode;
};

/** Colored pill that shows the state of a payment or wallet transaction. */
export function FinanceStatus({
  tone,
  icon: Icon,
  children,
}: FinanceStatusProps) {
  return (
    <Badge
      className={cn(
        "h-auto min-h-7 border-0 px-2.5 text-xs font-bold",
        FINANCE_STATUS_TONE_CLASS[tone],
      )}
    >
      <Icon aria-hidden />
      {children}
    </Badge>
  );
}
