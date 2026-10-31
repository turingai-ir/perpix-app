import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import type { PaymentViewStatus } from "@/feature/payment";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

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
    <span className={`finance-status finance-status-${tone}`}>
      <Icon aria-hidden="true" />
      {t(`pages.profile.payments.states.${status}`)}
    </span>
  );
}
