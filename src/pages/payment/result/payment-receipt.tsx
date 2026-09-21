import { motion, useReducedMotion } from "motion/react";
import { Check, Clock3, X } from "lucide-react";
import type { ReactNode } from "react";

import { formatLocalizedNumber } from "@/utils";

type PaymentReceiptProps = {
  accent: "success" | "pending" | "failed";
  actions: ReactNode;
  amountLabel: string;
  description: string;
  rows: Array<{ label: string; value: number }>;
  title: string;
  trackingCode: string;
  trackingLabel: string;
};

const styles = {
  success: {
    icon: Check,
    color: "text-emerald-500",
    surface: "bg-emerald-500/12",
  },
  pending: {
    icon: Clock3,
    color: "text-amber-500",
    surface: "bg-amber-500/12",
  },
  failed: { icon: X, color: "text-rose-500", surface: "bg-rose-500/12" },
};

export function PaymentReceipt(props: PaymentReceiptProps) {
  const reduceMotion = useReducedMotion();
  const stateStyle = styles[props.accent];
  const Icon = stateStyle.icon;

  return (
    <main className="bg-background flex min-h-dvh items-center justify-center px-4 py-8">
      <motion.section
        initial={{
          opacity: 0,
          transform: reduceMotion ? "none" : "translateY(12px)",
        }}
        animate={{ opacity: 1, transform: "translateY(0)" }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-lg"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{
              opacity: 0,
              transform: reduceMotion ? "none" : "scale(0.94)",
            }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={`flex size-20 items-center justify-center rounded-[1.75rem] ${stateStyle.surface} ${stateStyle.color}`}
          >
            <Icon aria-hidden="true" className="size-9 stroke-[2.5]" />
          </motion.div>
        </div>
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            {props.title}
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md leading-7">
            {props.description}
          </p>
        </div>
        <div className="bg-card mb-6 rounded-2xl border p-5 shadow-sm">
          <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground text-sm">
              {props.trackingLabel}
            </span>
            <bdi
              dir="ltr"
              className="font-mono text-sm font-semibold [overflow-wrap:anywhere]"
            >
              {props.trackingCode}
            </bdi>
          </div>
          <div className="space-y-4 pt-4">
            {props.rows.map((row, index) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4"
              >
                <span
                  className={
                    index === props.rows.length - 1
                      ? "font-medium"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {row.label}
                </span>
                <span
                  className={
                    index === props.rows.length - 1
                      ? `text-lg font-bold tabular-nums ${stateStyle.color}`
                      : "font-medium tabular-nums"
                  }
                >
                  {formatLocalizedNumber({ value: row.value })}{" "}
                  {props.amountLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">{props.actions}</div>
      </motion.section>
    </main>
  );
}
