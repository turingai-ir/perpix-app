import type { FC } from "react";
import { Radio } from "lucide-react";

import { formatLocalizedNumber } from "@/shared/utils";
import {
  FINANCE_CHIP_CLASS,
  FINANCE_PAGE_CLASS,
  FinanceHero,
} from "@/shared/components/finance";
import { PaymentDetailsDialog } from "../payment-details-dialog";
import { PaymentSummary } from "./payment-summary";
import { PaymentArchive } from "./payment-archive";
import { usePaymentsPage } from "../../hooks/use-payments-page";

export const PaymentHistoryPage: FC = () => {
  const pageState = usePaymentsPage();
  const { t, payments, detailsId, setDetailsId } = pageState;

  return (
    <div className={FINANCE_PAGE_CLASS} data-finance-page="payments">
      <FinanceHero
        kind="payments"
        title={t("pages.profile.finance.paymentsTitle")}
        description={t("pages.profile.finance.paymentsDescription")}
        artLabel={t("pages.profile.finance.paymentArt")}
      >
        <span className={FINANCE_CHIP_CLASS}>
          <Radio aria-hidden="true" />
          <strong>
            {t("pages.profile.finance.resultCount", {
              value: formatLocalizedNumber({ value: payments.length }),
            })}
          </strong>
        </span>
      </FinanceHero>
      <PaymentSummary payments={payments} />
      <PaymentArchive {...pageState} />
      {detailsId ? (
        <PaymentDetailsDialog
          intentUuid={detailsId}
          onClose={() => setDetailsId(null)}
        />
      ) : null}
    </div>
  );
};

export default PaymentHistoryPage;
