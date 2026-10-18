import { ArrowDownLeft, ArrowUpRight, RotateCcw } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import {
  WalletTransactionTypeEnumMap,
  type SchemaWalletTransactionTypeEnum,
} from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";

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
    <span className={`finance-status finance-status-${tone}`}>
      <Icon aria-hidden="true" />
      {t(`pages.profile.finance.${type}`)}
    </span>
  );
}
