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
    className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 sm:p-5"
    role="alert"
  >
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/75">
        <AlertCircle aria-hidden="true" className="size-5 text-destructive" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-6 font-semibold">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        {hint ? <p className="text-sm leading-6">{hint}</p> : null}
        {notice ? (
          <p className="text-xs leading-5 text-muted-foreground">{notice}</p>
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
