import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsdmicroInputHint } from "@/components/custom/usdmicro-amount";
import { useAppTranslate } from "@/hooks";
import {
  effectiveProfit,
  MAX_TIERS,
  type TierForm,
} from "../model/topup-policy-form";
import { UsdmicroInput } from "@/components/custom/usdmicro-input";

const faNumber = (value: string) =>
  value === "—" ? value : new Intl.NumberFormat("fa-IR").format(Number(value));

type Props = {
  tiers: TierForm[];
  profitPercent: string;
  onChange: (tiers: TierForm[]) => void;
};

/** The discount leagues: a charge from the given micro-dollar amount up to the next league gets that discount. */
export function TopupTiersEditor({ tiers, profitPercent, onChange }: Props) {
  const { t } = useAppTranslate();
  const update = (index: number, patch: Partial<TierForm>) =>
    onChange(
      tiers.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)),
    );

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground grid grid-cols-[1fr_1fr_1fr_auto] gap-3 text-xs font-semibold">
        <span>
          {t("features.finance.topupPolicy.tierFrom", {
            defaultValue: "از مبلغ شارژ (میکرودلار)",
          })}
        </span>
        <span>
          {t("features.finance.topupPolicy.tierDiscount", {
            defaultValue: "تخفیف روی سود ما (٪)",
          })}
        </span>
        <span>
          {t("features.finance.topupPolicy.tierEffective", {
            defaultValue: "سود ما بعد از تخفیف (٪)",
          })}
        </span>
        <span className="w-9" />
      </div>
      {tiers.map((tier, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_1fr_auto] items-start gap-3"
        >
          <div className="space-y-1">
            <UsdmicroInput
              value={tier.fromUsdmicro}
              disabled={index === 0}
              onValueChange={(v) => update(index, { fromUsdmicro: v })}
            />
            <UsdmicroInputHint value={tier.fromUsdmicro} />
          </div>
          <Input
            dir="ltr"
            inputMode="numeric"
            value={tier.discountPercent}
            onChange={(e) => update(index, { discountPercent: e.target.value })}
          />
          <span className="pt-2 text-sm font-semibold tabular-nums">
            {faNumber(effectiveProfit(profitPercent, tier.discountPercent))}٪
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === 0}
            aria-label={t("features.finance.topupPolicy.removeTier", {
              defaultValue: "حذف لیگ",
            })}
            onClick={() => onChange(tiers.filter((_, i) => i !== index))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={tiers.length >= MAX_TIERS}
        onClick={() =>
          onChange([...tiers, { fromUsdmicro: "", discountPercent: "" }])
        }
      >
        <Plus className="size-4" />
        {t("features.finance.topupPolicy.addTier", {
          defaultValue: "افزودن لیگ",
        })}
      </Button>
    </div>
  );
}
