import { type CSSProperties, type FC, type ReactNode } from "react";

import styles from "./account-widget.module.css";

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
      className={styles.ring}
      data-tone={tone}
      data-large={size >= 60 || undefined}
      style={{ "--ring-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--ring-from)" />
            <stop offset="100%" stopColor="var(--ring-to)" />
          </linearGradient>
        </defs>
        <circle
          className={styles.ringTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={STROKE}
        />
        {ratio === null ? null : (
          <circle
            className={styles.ringFill}
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
      <span className={styles.ringContent}>{children}</span>
    </span>
  );
};

export default DaysRing;
