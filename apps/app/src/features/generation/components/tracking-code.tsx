import { useEffect, useRef, useState, type FC } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";

/** The answer's id, for the user to give support; copied whole. */
export const TrackingCode: FC<{ code: string }> = ({ code }) => {
  const { t } = useAppTranslate();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="text-muted-foreground flex items-center gap-1 text-xs">
      <span>{t("common.generationFailure.trackingCode")}</span>
      <bdi className="font-mono" data-tracking-code={code}>
        {code.slice(0, 8)}
      </bdi>
      <Button
        aria-label={t(
          copied
            ? "common.generationFailure.trackingCodeCopied"
            : "common.generationFailure.copyTrackingCode",
        )}
        onClick={() => void copyCode()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
    </div>
  );
};
