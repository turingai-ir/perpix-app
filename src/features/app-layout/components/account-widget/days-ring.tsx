import { type CSSProperties, type FC, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export type RingTone = "active" | "expiring" | "free";

type DaysRingProps = {
  ratio: number | null;
  tone: RingTone;
  size: number;
  children: ReactNode;
};

const STROKE = 3.5;

/** Circular progress of the subscription period; decorative, text is outside. */
const DaysRing: FC<DaysRingProps> = ({ ratio, tone, size, children }) => {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (ratio ?? 0));
  const gradientId = `ring-${tone}-${size}`;

  return (
    <span
      className={cn(
        "group/ring relative inline-grid size-(--ring-size) flex-none place-items-center",
        "[--ring-from:var(--accent-violet)] [--ring-to:var(--accent-pink)]",
        "data-[tone=expiring]:[--ring-from:var(--accent-orange)] data-[tone=expiring]:[--ring-to:var(--accent-gold)]",
        "data-[tone=free]:[--ring-from:var(--accent-blue)] data-[tone=free]:[--ring-to:var(--accent-sky)]",
      )}
      data-tone={tone}
      data-large={size >= 60 || undefined}
      style={{ "--ring-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 size-full -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--ring-from)" />
            <stop offset="100%" stopColor="var(--ring-to)" />
          </linearGradient>
        </defs>
        <circle
          className="fill-none stroke-white/10"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={STROKE}
        />
        {ratio === null ? null : (
          <circle
            className="ease-out-quint fill-none transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
            strokeLinecap="round"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={STROKE}
            stroke={`url(#${gradientId})`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        )}
      </svg>
      <span className="group-data-[tone=free]/ring:text-accent-sky relative flex flex-col items-center leading-tight tabular-nums [&_b]:text-xs [&_b]:font-extrabold group-data-[large]/ring:[&_b]:text-[1.35rem] [&_small]:text-[0.625rem] [&_small]:text-white/65">
        {children}
      </span>
    </span>
  );
};

export default DaysRing;
