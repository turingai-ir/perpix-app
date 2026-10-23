import { ArrowDownToLine, ArrowUpFromLine, RotateCcw } from "lucide-react";

import { FinanceSummary } from "@/pages/profile/_components/finance-summary";
import {
  WalletTransactionTypeEnumMap,
  type SchemaWalletTransactionResponse,
} from "@/services/api";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTokenAmount } from "@/utils";

export function WalletSummary({
  transactions,
}: {
  transactions: readonly SchemaWalletTransactionResponse[];
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const total = (type: SchemaWalletTransactionResponse["type"]) =>
    transactions
      .filter((transaction) => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount_usdmicro, 0);
  const unit = t("common.token");

  return (
    <FinanceSummary
      items={[
        {
          label: t("pages.profile.finance.depositTotal"),
          value: formatTokenAmount(total(WalletTransactionTypeEnumMap.DEPOSIT)),
          unit,
          icon: ArrowDownToLine,
          tone: "positive",
        },
        {
          label: t("pages.profile.finance.withdrawTotal"),
          value: formatTokenAmount(
            total(WalletTransactionTypeEnumMap.WITHDRAW),
          ),
          unit,
          icon: ArrowUpFromLine,
          tone: "negative",
        },
        {
          label: t("pages.profile.finance.refundTotal"),
          value: formatTokenAmount(total(WalletTransactionTypeEnumMap.REFUND)),
          unit,
          icon: RotateCcw,
          tone: "neutral",
        },
      ]}
    />
  );
}
