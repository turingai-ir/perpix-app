import { ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";

import { useAppTranslate } from "@/shared/hooks";
import {
  WalletTransactionTypeEnumMap,
  type SchemaWalletTransactionTypeEnum,
} from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { FinanceStatus } from "@/pages/profile/_components/finance-status";

const typeView = {
  [WalletTransactionTypeEnumMap.DEPOSIT]: {
    icon: ArrowDownLeft,
    tone: "positive",
  },
  [WalletTransactionTypeEnumMap.WITHDRAW]: {
    icon: ArrowUpRight,
    tone: "negative",
  },
  [WalletTransactionTypeEnumMap.REFUND]: {
    icon: RotateCcw,
    tone: "review",
  },
} as const;

export function WalletTransactionType({
  type,
}: {
  type: SchemaWalletTransactionTypeEnum;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { icon: Icon, tone } = typeView[type];
  return (
    <FinanceStatus tone={tone} icon={Icon}>
      {t(`pages.profile.finance.${type}`)}
    </FinanceStatus>
  );
}
