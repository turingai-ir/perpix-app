import { useAppTranslate } from "@/hooks/i18";
import { useFileClock } from "../hooks/use-file-clock";
import { canUseFileForGeneration } from "../model/expiry";
import type { UserFileItem } from "../model/types";

export function FileDetails({
  file,
  forGeneration = false,
}: {
  file: UserFileItem;
  forGeneration?: boolean;
}) {
  const { t, i18n } = useAppTranslate();
  const now = useFileClock();
  const facts = file.media_metadata;
  const locale = i18n.language || "fa";
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const expiry = file.expire_at ? Date.parse(file.expire_at) : NaN;
  const expired = Number.isFinite(expiry) && expiry <= now;
  const unavailable = forGeneration && !canUseFileForGeneration(file, now);
  return (
    <div className="text-muted-foreground space-y-0.5 text-xs">
      {facts?.width && facts.height ? (
        <p>
          {t("features.fileManager.details.dimensions", {
            width: number.format(facts.width),
            height: number.format(facts.height),
          })}
        </p>
      ) : null}
      {facts?.duration_seconds != null ? (
        <p>
          {t("features.fileManager.details.duration", {
            seconds: number.format(facts.duration_seconds),
          })}
        </p>
      ) : null}
      {!facts ? <p>{t("features.fileManager.details.unknown")}</p> : null}
      {Number.isFinite(expiry) ? (
        <p className={expired || unavailable ? "text-destructive" : undefined}>
          {expired
            ? t("features.fileManager.details.expired")
            : t("features.fileManager.details.expires", {
                date: new Intl.DateTimeFormat(locale, {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(expiry),
              })}
        </p>
      ) : null}
      {unavailable && !expired ? (
        <p className="text-destructive">
          {t("features.fileManager.details.expiring")}
        </p>
      ) : null}
    </div>
  );
}
