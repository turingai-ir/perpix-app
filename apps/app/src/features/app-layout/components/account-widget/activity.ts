export interface ActivityTransaction {
  amount_usdmicro: number;
  created_at: string;
}

export interface DailyActivity {
  /** Tokens (usdmicro) spent today and how many creations that was. */
  todaySpent: number;
  todayCount: number;
  /** Spent usdmicro per local day, oldest first, last item is today. */
  series: number[];
  maxSpent: number;
}

const DAY_COUNT = 7;

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/** Buckets WITHDRAW transactions into the last 7 local days. */
export function summarizeActivity(
  transactions: readonly ActivityTransaction[],
  now: Date = new Date(),
): DailyActivity {
  const keys = Array.from({ length: DAY_COUNT }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (DAY_COUNT - 1 - index));
    return dayKey(day);
  });
  const series = keys.map(() => 0);
  let todayCount = 0;

  for (const transaction of transactions) {
    const createdAt = new Date(transaction.created_at);
    if (Number.isNaN(createdAt.getTime())) continue;
    const index = keys.indexOf(dayKey(createdAt));
    if (index < 0) continue;
    series[index] += Math.abs(transaction.amount_usdmicro);
    if (index === DAY_COUNT - 1) todayCount += 1;
  }

  return {
    todaySpent: series[DAY_COUNT - 1],
    todayCount,
    series,
    maxSpent: Math.max(...series, 0),
  };
}

export const LOW_RUNWAY_DAYS = 3;

/** Whole days the balance lasts at this week's average spend, or null. */
export function getRunwayDays(
  balanceUsdmicro: number,
  series: readonly number[],
): number | null {
  const total = series.reduce((sum, value) => sum + value, 0);
  if (total <= 0 || balanceUsdmicro <= 0 || series.length === 0) return null;
  return Math.floor(balanceUsdmicro / (total / series.length));
}
