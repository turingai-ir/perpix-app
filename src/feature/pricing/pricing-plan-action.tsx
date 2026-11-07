import { useState, type FC } from "react";
import { CircleCheck, LoaderCircle } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

export type PricingPlanActionKind =
  | "buy"
  | "upgrade"
  | "renew"
  | "current"
  | "lower";

type PricingPlanActionProps = {
  kind: PricingPlanActionKind;
  isRecommended: boolean;
  isPending: boolean;
  isDisabled: boolean;
  /** Paid users get a confirm step because the backend replaces or extends. */
  needsConfirm: boolean;
  onPurchase: () => Promise<void>;
};

const LABEL_KEYS: Record<PricingPlanActionKind, string> = {
  buy: "features.pricing.purchase",
  upgrade: "features.pricing.upgrade",
  renew: "features.pricing.renew",
  current: "features.pricing.currentPlan",
  lower: "features.pricing.lowerTier",
};

const PricingPlanAction: FC<PricingPlanActionProps> = ({
  kind,
  isRecommended,
  isPending,
  isDisabled,
  needsConfirm,
  onPurchase,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [isConfirming, setIsConfirming] = useState(false);
  const isLocked = kind === "current" || kind === "lower";
  const showConfirm = needsConfirm && isConfirming && !isLocked;

  const handleClick = async () => {
    if (needsConfirm && !isConfirming) {
      setIsConfirming(true);
      return;
    }
    await onPurchase();
  };

  if (kind === "current") {
    return (
      <div
        role="status"
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-300/40 bg-sky-300/15 px-4 text-sm font-bold text-sky-200"
      >
        <CircleCheck className="size-4" aria-hidden="true" />
        {t("features.pricing.yourPlan")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showConfirm ? (
        <p role="status" className="text-muted-foreground text-xs leading-6">
          {t("features.pricing.confirmNotice")}
        </p>
      ) : null}
      <Button
        type="button"
        variant={isRecommended || kind === "upgrade" || kind === "renew" ? "default" : "outline"}
        size="lg"
        className="w-full"
        disabled={isPending || isDisabled || isLocked}
        onClick={handleClick}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          t(showConfirm ? "features.pricing.confirmAction" : LABEL_KEYS[kind])
        )}
      </Button>
      {showConfirm && !isPending ? (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setIsConfirming(false)}
        >
          {t("features.pricing.cancel")}
        </Button>
      ) : null}
    </div>
  );
};

export default PricingPlanAction;
