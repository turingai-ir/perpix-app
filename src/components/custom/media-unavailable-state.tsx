import { FileQuestion, RefreshCw, TriangleAlert } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

interface Props {
  compact?: boolean;
  isRefreshing?: boolean;
  kind: "missing" | "temporary";
  onAction?: () => void;
  actionLabel?: string;
  actionTo?: string;
  onRetry?: () => void;
  showRetentionInfo?: boolean;
}

export function MediaUnavailableState({
  compact = false,
  isRefreshing = false,
  kind,
  onAction,
  actionLabel,
  actionTo,
  onRetry,
  showRetentionInfo = false,
}: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const missing = kind === "missing";
  const title = t(
    missing
      ? "pages.generation.mediaUnavailable.missingTitle"
      : "pages.generation.mediaUnavailable.temporaryTitle",
  );
  let descriptionKey = "pages.generation.mediaUnavailable.temporaryDescription";
  if (missing) {
    descriptionKey = showRetentionInfo
      ? "pages.generation.mediaUnavailable.retentionDescription"
      : "pages.generation.mediaUnavailable.missingDescription";
  }
  const compactTitle = t(
    missing
      ? "pages.generation.mediaUnavailable.compactTitle"
      : "pages.generation.mediaUnavailable.compactTemporaryTitle",
  );

  return (
    <div
      role={missing ? "status" : "alert"}
      className={cn(
        "flex h-full w-full min-w-0 flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center",
        compact && "gap-1 rounded-lg p-1.5",
        missing
          ? "border-border/70 bg-muted/45 text-foreground"
          : "border-destructive/30 bg-destructive/5 text-foreground",
      )}
    >
      {compact && !missing && onRetry ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          aria-label={t("pages.generation.mediaUnavailable.retry")}
          disabled={isRefreshing}
          onClick={onRetry}
        >
          <RefreshCw aria-hidden="true" className="size-5" />
        </Button>
      ) : (
        <span
          className={cn(
            "bg-background/75 flex size-10 shrink-0 items-center justify-center rounded-xl",
            compact && "size-7 rounded-lg",
          )}
        >
          {missing ? (
            <FileQuestion aria-hidden="true" className="size-5" />
          ) : (
            <TriangleAlert
              aria-hidden="true"
              className="text-destructive size-5"
            />
          )}
        </span>
      )}
      <p
        className={cn(
          "text-sm leading-6 font-semibold",
          compact && "text-xs leading-4",
        )}
      >
        {compact ? compactTitle : title}
      </p>
      {!compact && (
        <p className="text-muted-foreground max-w-xs text-sm leading-6">
          {t(descriptionKey)}
        </p>
      )}
      {!compact && missing && onAction && actionLabel && (
        <Button
          type="button"
          variant="secondary"
          className="mt-1 min-h-11"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
      {!compact && missing && actionTo && actionLabel && (
        <Button asChild variant="secondary" className="mt-1 min-h-11">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
      {!compact && !missing && onRetry && (
        <Button
          type="button"
          variant="outline"
          className="mt-1 min-h-11 gap-2"
          disabled={isRefreshing}
          onClick={onRetry}
        >
          <RefreshCw
            aria-hidden="true"
            className={cn("size-4", isRefreshing && "motion-safe:animate-spin")}
          />
          {t("pages.generation.mediaUnavailable.retry")}
        </Button>
      )}
    </div>
  );
}
