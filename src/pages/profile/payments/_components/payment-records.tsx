import type { SchemaPaymentHistoryItemResponse } from "@/services/api";

import { PaymentMobileList } from "./payment-mobile-list";
import { PaymentTable } from "./payment-table";

type Props = {
  payments: readonly SchemaPaymentHistoryItemResponse[];
  onOpenDetails: (id: string) => void;
};

export function PaymentRecords({ payments, onOpenDetails }: Props) {
  return (
    <>
      <PaymentMobileList payments={payments} onOpenDetails={onOpenDetails} />
      <PaymentTable payments={payments} onOpenDetails={onOpenDetails} />
    </>
  );
}
