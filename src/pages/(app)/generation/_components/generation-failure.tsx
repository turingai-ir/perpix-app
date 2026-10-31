import type { FC } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GenerationFailureProps {
  description: string;
  isRetrying: boolean;
  onRetry?: () => void;
  retryLabel: string;
  title: string;
}

export const GenerationFailure: FC<GenerationFailureProps> = ({
  description,
  isRetrying,
  onRetry,
  retryLabel,
  title,
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
        <RefreshCw
          aria-hidden="true"
          className={isRetrying ? "motion-safe:animate-spin" : ""}
        />
        {retryLabel}
      </Button>
    ) : null}
  </div>
);
