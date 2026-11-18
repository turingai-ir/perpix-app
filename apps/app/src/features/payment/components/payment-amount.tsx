import type { SchemaSupportedCurrency } from "@/shared/api";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { paymentCurrencyDisplay } from "../model/payment-money";

type Props = { amount: string | number; currency: SchemaSupportedCurrency };

export function PaymentAmount({ amount, currency }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const display = paymentCurrencyDisplay[currency];
  return (
    <span>
      {display.format(amount)} {t(display.label)}
    </span>
  );
}
