import type { FC } from "react";
import { ShieldCheck } from "lucide-react";

import { TrackingCode } from "./tracking-code";

import { useAppTranslate } from "@/shared/hooks";

/**
 * Shown instead of the progress placeholder while support reviews the
 * generation: it is not generating, and support will finish or fail it.
 */
export const GenerationReview: FC<{ trackingCode: string }> = ({
  trackingCode,
}) => {
  const { t } = useAppTranslate();
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border bg-muted/40 p-4 sm:p-5"
      data-generation-review=""
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/75">
          <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm leading-6 font-semibold">
            {t("common.generationReview.title")}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("common.generationReview.description")}
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            {t("common.generationReview.notCharged")}
          </p>
          <TrackingCode code={trackingCode} />
        </div>
      </div>
    </div>
  );
};
