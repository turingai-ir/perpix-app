import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { usePaymentDetails } from "../hooks/use-payment-details";
import { PaymentBreakdown } from "./payment-breakdown";

export function PaymentDetailsDialog({
  intentUuid,
  onClose,
}: {
  intentUuid: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const details = usePaymentDetails(intentUuid);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("pages.profile.payments.details")}</DialogTitle>
          <DialogDescription>{intentUuid}</DialogDescription>
        </DialogHeader>
        {details.isLoading ? <LoadingSection /> : null}
        {details.isError ? (
          <ErrorSection onRetry={() => void details.refetch()} />
        ) : null}
        {details.data ? <PaymentBreakdown payment={details.data} /> : null}
      </DialogContent>
    </Dialog>
  );
}
