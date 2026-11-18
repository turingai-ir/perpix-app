import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ReportBucketLike {
  readonly key: string;
  readonly count: number;
}

interface ReportBucketListProps {
  title: string;
  buckets: readonly ReportBucketLike[];
  isLoading?: boolean;
  /** Maps a raw bucket key to a display label. */
  labelFor?: (key: string) => string;
  /** Rendered after the count, e.g. "کاربر". */
  unit?: string;
  /** Keep only the first N buckets (e.g. latest days). */
  maxItems?: number;
}

const formatCount = (count: number) => count.toLocaleString("fa-IR");

/** A titled list of report buckets with a proportional bar behind each row. */
export function ReportBucketList({
  title,
  buckets,
  isLoading,
  labelFor = (key) => key,
  unit,
  maxItems,
}: ReportBucketListProps) {
  const rows = maxItems ? buckets.slice(0, maxItems) : buckets;
  const max = Math.max(1, ...rows.map((b) => b.count));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p
            role="status"
            className="text-muted-foreground py-6 text-center text-xs"
          >
            در حال دریافت آمار...
          </p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-xs">
            داده‌ای برای نمایش موجود نیست.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {rows.map((bucket) => (
              <li
                key={bucket.key}
                className="relative flex items-center justify-between overflow-hidden rounded-md border px-3 py-1.5 text-xs"
              >
                <span
                  aria-hidden="true"
                  className="bg-primary/10 absolute inset-y-0 start-0"
                  style={{ width: `${(bucket.count / max) * 100}%` }}
                />
                <span className="relative font-mono" dir="ltr">
                  {labelFor(bucket.key)}
                </span>
                <span className="relative font-bold">
                  {formatCount(bucket.count)}
                  {unit ? ` ${unit}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
