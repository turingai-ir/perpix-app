import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import ErrorSection from "@/shared/components/error-section";
import LoadingSection from "@/shared/components/loading-section";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import type { SchemaPaymentResponse } from "@/shared/api";
import { usePaymentDetails } from "../hooks/use-payment-details";
import { PaymentBreakdown } from "./payment-breakdown";
import { PaymentRedirectControls } from "./payment-redirect-controls";

type Props = {
  payment: SchemaPaymentResponse & { payment_url: string };
  onClose: () => void;
};

export function PaymentConfirmationDialog({ payment, onClose }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const details = usePaymentDetails(payment.id);
  const matchesPurchase =
    details.data?.id === payment.id &&
    details.data.currency === payment.currency &&
    details.data.total_amount === payment.amount;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-right!">
          <DialogTitle>{t("pages.payment.redirect.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.payment.redirect.description")}
          </DialogDescription>
        </DialogHeader>
        {details.isLoading ? <LoadingSection /> : null}
        {details.isError || (details.isSuccess && !matchesPurchase) ? (
          <ErrorSection onRetry={() => void details.refetch()} />
        ) : null}
        {details.data && matchesPurchase ? (
          <>
            <PaymentBreakdown payment={details.data} />
            <PaymentRedirectControls paymentUrl={payment.payment_url} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
