import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import type { PaymentViewStatus } from "@/features/payment";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { FinanceStatus } from "@/pages/profile/_components/finance-status";

const statusView = {
  pending: { icon: Clock3, tone: "pending" },
  processing: { icon: LoaderCircle, tone: "pending" },
  succeeded: { icon: CheckCircle2, tone: "positive" },
  failed: { icon: XCircle, tone: "negative" },
  review: { icon: ShieldAlert, tone: "review" },
} as const;

export function PaymentStatus({ status }: { status: PaymentViewStatus }) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { icon: Icon, tone } = statusView[status];

  return (
    <FinanceStatus tone={tone} icon={Icon}>
      {t(`pages.profile.payments.states.${status}`)}
    </FinanceStatus>
  );
}
