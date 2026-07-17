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
    aria-live="polite"
    className="border-destructive/30 bg-destructive/5 flex flex-col gap-3 rounded-md border p-3"
    role="alert"
  >
    <div className="flex items-start gap-2">
      <AlertCircle aria-hidden className="text-destructive mt-0.5 size-4" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
    {onRetry ? (
      <Button
        className="w-fit"
        disabled={isRetrying}
        onClick={onRetry}
        size="sm"
        type="button"
        variant="outline"
      >
        <RefreshCw aria-hidden className={isRetrying ? "animate-spin" : ""} />
        {retryLabel}
      </Button>
    ) : null}
  </div>
);
