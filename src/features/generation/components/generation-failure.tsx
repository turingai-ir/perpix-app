import type { FC } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { TrackingCode } from "./tracking-code";

import { Button } from "@/shared/ui/button";

interface GenerationFailureProps {
  description: string;
  hint?: string;
  /** What it cost, when the backend guarantees it. */
  notice?: string;
  isRetrying: boolean;
  onRetry?: () => void;
  retryLabel: string;
  title: string;
  trackingCode?: string;
}

export const GenerationFailure: FC<GenerationFailureProps> = ({
  description,
  hint,
  notice,
  isRetrying,
  onRetry,
  retryLabel,
  title,
  trackingCode,
}) => (
  <div
    className="border-destructive/30 bg-destructive/5 flex flex-col gap-3 rounded-2xl border p-4 sm:p-5"
    role="alert"
  >
    <div className="flex items-start gap-3">
      <span className="bg-background/75 flex size-10 shrink-0 items-center justify-center rounded-xl">
        <AlertCircle aria-hidden="true" className="text-destructive size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-6 font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
        {hint ? <p className="text-sm leading-6">{hint}</p> : null}
        {notice ? (
          <p className="text-muted-foreground text-xs leading-5">{notice}</p>
        ) : null}
        {trackingCode ? <TrackingCode code={trackingCode} /> : null}
      </div>
    </div>
    {onRetry ? (
      <Button
        className="min-h-11 w-fit gap-2"
        disabled={isRetrying}
        onClick={onRetry}
        type="button"
        variant="outline"
      >
        {/* `isRetrying` is page-wide busy state, not this card's retry: the
            new turn shows its own progress, so the icon must not spin. */}
        <RefreshCw aria-hidden="true" />
        {retryLabel}
      </Button>
    ) : null}
  </div>
);
