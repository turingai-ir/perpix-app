import { useAppTranslate } from "@/hooks";
import type { UserFileItem } from "../model/contracts";
import { useFileTime } from "../hooks/use-file-time";

export function FileFacts({
  file,
  forGeneration = false,
}: {
  file: UserFileItem;
  forGeneration?: boolean;
}) {
  const { t, i18n } = useAppTranslate();
  const facts = file.media_metadata;
  const now = useFileTime(forGeneration);
  const locale = i18n.language || "fa";
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const expires = file.expire_at ? Date.parse(file.expire_at) : NaN;
  const expiring =
    forGeneration && Number.isFinite(expires) && expires <= now + 60 * 60_000;
  return (
    <div className="text-muted-foreground space-y-0.5 text-xs">
      {facts?.width && facts.height ? (
        <p>
          {t("features.fileManager.facts.size", {
            width: numbers.format(facts.width),
            height: numbers.format(facts.height),
          })}
        </p>
      ) : null}
      {facts?.duration_seconds != null ? (
        <p>
          {t("features.fileManager.facts.duration", {
            seconds: numbers.format(facts.duration_seconds),
          })}
        </p>
      ) : null}
      {!facts ? <p>{t("features.fileManager.facts.unknown")}</p> : null}
      {Number.isFinite(expires) ? (
        <p>
          {t("features.fileManager.facts.expiry", {
            date: new Intl.DateTimeFormat(locale, {
              dateStyle: "short",
              timeStyle: "short",
            }).format(expires),
          })}
        </p>
      ) : null}
      {expiring ? (
        <p className="text-destructive">
          {t("features.fileManager.facts.expiring")}
        </p>
      ) : null}
    </div>
  );
}
