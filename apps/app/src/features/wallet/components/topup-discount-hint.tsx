import { useState } from "react";
import { useDebounce } from "react-use";
import { BadgePercent } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import {
  formatLocalizedNumber,
  formatTomanAmount,
  parseTokenAmount,
} from "@/shared/utils";

import { useTopupQuote } from "../hooks/wallet-queries";

type TopupDiscountHintProps = {
  /** The amount as typed, in tokens. */
  amount: string;
  minUsdmicro: number;
  maxUsdmicro: number;
};

const KEY = "pages.app.layout.sidebar.balanceCard.chargeWallet";
const DEBOUNCE_MS = 400;

/** Tells the customer what this charge saves and what the next tier would save. */
export function TopupDiscountHint({
  amount,
  minUsdmicro,
  maxUsdmicro,
}: TopupDiscountHintProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [settled, setSettled] = useState(amount);
  useDebounce(() => setSettled(amount), DEBOUNCE_MS, [amount]);

  const usdmicro = parseTokenAmount(settled);
  const inRange =
    usdmicro !== null && usdmicro >= minUsdmicro && usdmicro <= maxUsdmicro;
  const quote = useTopupQuote(inRange ? usdmicro : null).data;
  if (!inRange || !quote) return null;

  const saving = quote.discount_irr ?? 0;
  const next = quote.next_tier;
  const nextSaving = next?.discount_irr ?? 0;
  const showNext = next !== null && nextSaving > saving;
  if (saving <= 0 && !showNext) return null;

  return (
    <div
      aria-live="polite"
      className="flex flex-col gap-1 text-sm font-semibold text-accent-emerald"
    >
      {saving > 0 ? (
        <p className="flex items-center gap-2">
          <BadgePercent aria-hidden="true" className="size-4 shrink-0" />
          {t(`${KEY}.discountNow`, { amount: formatTomanAmount(saving) })}
        </p>
      ) : null}
      {showNext ? (
        <p className="font-medium text-muted-foreground">
          {t(`${KEY}.discountNext`, {
            tokens: formatLocalizedNumber({
              value: next.from_amount_usdmicro / 1000,
            }),
            amount: formatTomanAmount(nextSaving),
          })}
        </p>
      ) : null}
    </div>
  );
}
