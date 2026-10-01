import type { SchemaSupportedCurrency } from "@/services/api";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
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
