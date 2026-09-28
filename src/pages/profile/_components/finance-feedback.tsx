import { CircleAlert, ReceiptText } from "lucide-react";
import { useAppTranslate } from "@/hooks";

type Props = {
  loading: boolean;
  error: boolean;
  paused: boolean;
  hasData: boolean;
  empty: boolean;
  noResults: boolean;
  variant: "payments" | "wallet";
  onRetry: () => void;
  onClear: () => void;
};

export function FinanceFeedback({
  loading,
  error,
  paused,
  hasData,
  empty,
  noResults,
  variant,
  onRetry,
  onClear,
}: Props) {
  const { t } = useAppTranslate();
  if (paused)
    return (
      <p className="finance-notice" role="status">
        <CircleAlert size={18} aria-hidden="true" />
        {t("pages.profile.finance.offline")}
      </p>
    );
  if (loading && !hasData)
    return (
      <div className="finance-loading" role="status">
        <span>{t("pages.profile.finance.loading")}</span>
        {[0, 1, 2].map((index) => (
          <div key={index} className="finance-skeleton" aria-hidden="true" />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="finance-notice" role="alert">
        <CircleAlert size={20} aria-hidden="true" />
        <span>
          {t(
            hasData
              ? "pages.profile.finance.stale"
              : "pages.profile.finance.loadError",
          )}
        </span>
        <button type="button" className="finance-text-button" onClick={onRetry}>
          {t("pages.profile.finance.retry")}
        </button>
      </div>
    );
  if (!empty && !noResults) return null;
  let message:
    | "pages.profile.finance.noResults"
    | "pages.profile.finance.emptyPayments"
    | "pages.profile.finance.emptyWallet" = "pages.profile.finance.noResults";
  if (empty)
    message =
      variant === "payments"
        ? "pages.profile.finance.emptyPayments"
        : "pages.profile.finance.emptyWallet";
  return (
    <div className="finance-empty" role="status">
      <ReceiptText size={32} aria-hidden="true" />
      <p>{t(message)}</p>
      {noResults && !empty && (
        <button type="button" className="finance-text-button" onClick={onClear}>
          {t("pages.profile.finance.clearFilters")}
        </button>
      )}
    </div>
  );
}
