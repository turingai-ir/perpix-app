const DAY_MS = 86_400_000;

/** Whole days until the project ends, rounded up, never below 0. */
export const daysLeft = (expireAt: string, now: number): number =>
  Math.max(0, Math.ceil((Date.parse(expireAt) - now) / DAY_MS));

/** A project this close to its end is shown as a warning. */
export const EXPIRY_WARNING_DAYS = 2;

const relative = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });

const UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ["day", DAY_MS],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** "۲ ساعت پیش", "دیروز", "همین حالا". */
export const relativeTime = (iso: string, now: number): string => {
  const diff = Date.parse(iso) - now;
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size) {
      return relative.format(Math.round(diff / size), unit);
    }
  }
  return relative.format(0, "second");
};
