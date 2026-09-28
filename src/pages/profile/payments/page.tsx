import { useState } from "react";
import { CheckCheck, Clock3, CircleX, ReceiptText } from "lucide-react";
import { useSearchParams } from "react-router";
import { usePayments } from "@/feature/payment";
import { useAppTranslate } from "@/hooks";
import type { SchemaPaymentListItemResponse } from "@/services/api";
import { FinanceHero } from "../_components/finance-hero";
import { FinanceToolbar } from "../_components/finance-toolbar";
import { FinanceFeedback } from "../_components/finance-feedback";
import { PaginationFooter } from "../_components/pagination-footer";
import { financeNumber, financeOffset } from "../_components/finance-format";
import { PaymentRecord } from "./payment-record";
import "../finance.css";

const PAGE_LIMIT = 20;
const filters = ["all", "PAID", "PENDING", "FAILED"] as const;

export default function ProfilePaymentsPage() {
  const { t, i18n } = useAppTranslate();
  const [params, setParams] = useSearchParams();
  const offset = financeOffset(params.get("offset"));
  const query = usePayments({ offset, limit: PAGE_LIMIT });
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  // The API wrapper maps readonly arrays as objects; normalize at this boundary.
  const payments = Array.from(
    (query.data?.items ?? []) as ArrayLike<SchemaPaymentListItemResponse>,
  );
  const visible = payments.filter(
    (item) =>
      (selected === "all" || item.status === selected) &&
      item.payment_uuid.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const metrics = [
    {
      label: "paidTotal",
      icon: CheckCheck,
      value: payments
        .filter((item) => item.status === "PAID")
        .reduce((total, item) => total + item.total_amount_irr, 0),
      unit: "rial",
      tone: "positive",
    },
    {
      label: "pendingCount",
      icon: Clock3,
      value: payments.filter((item) => item.status === "PENDING").length,
      unit: "recordUnit",
      tone: "pending",
    },
    {
      label: "failedCount",
      icon: CircleX,
      value: payments.filter((item) => item.status === "FAILED").length,
      unit: "recordUnit",
      tone: "negative",
    },
  ] as const;
  const clear = () => {
    setSelected("all");
    setSearch("");
  };
  function goToOffset(next: number) {
    clear();
    setParams((previous) => {
      const updated = new URLSearchParams(previous);
      updated.set("offset", String(Math.max(0, next)));
      return updated;
    });
  }
  return (
    <div className="finance-page finance-page--payments">
      <FinanceHero variant="payments" />
      <div className="finance-section-heading">
        <span className="finance-eyebrow">
          <ReceiptText size={16} aria-hidden="true" />
          {t("pages.profile.finance.paymentArchive")}
        </span>
        <p>{t("pages.profile.finance.pageScope")}</p>
      </div>
      <dl className="finance-metrics">
        {metrics.map(({ label, icon: Icon, value, unit, tone }) => (
          <div key={label} className={`finance-metric finance-metric--${tone}`}>
            <Icon size={20} aria-hidden="true" />
            <div>
              <dt>{t(`pages.profile.finance.${label}`)}</dt>
              <dd>
                {query.data ? financeNumber(value, i18n.language) : "—"}
                <small>{t(`pages.profile.finance.${unit}`)}</small>
              </dd>
            </div>
          </div>
        ))}
      </dl>
      <section
        className="finance-ledger"
        aria-label={t("pages.profile.finance.paymentArchive")}
      >
        <FinanceToolbar
          options={filters}
          selected={selected}
          search={search}
          onSelect={setSelected}
          onSearch={setSearch}
          onRefresh={() => query.refetch()}
          fetching={query.isFetching}
        />
        <FinanceFeedback
          loading={query.isPending}
          error={query.isError}
          paused={query.fetchStatus === "paused"}
          hasData={!!query.data}
          empty={query.isSuccess && payments.length === 0}
          noResults={query.isSuccess && visible.length === 0}
          variant="payments"
          onRetry={() => query.refetch()}
          onClear={clear}
        />
        {payments.length > 0 && (
          <p className="finance-result-count" role="status">
            {t("pages.profile.finance.resultCount", {
              value: financeNumber(visible.length, i18n.language),
            })}
          </p>
        )}
        <div className="finance-records" aria-busy={query.isFetching}>
          {visible.map((payment) => (
            <PaymentRecord key={payment.payment_uuid} payment={payment} />
          ))}
        </div>
        <PaginationFooter
          offset={offset}
          count={payments.length}
          hasNext={query.data?.has_next ?? false}
          isFetching={query.isFetching}
          onPrevious={() => goToOffset(offset - PAGE_LIMIT)}
          onNext={() => goToOffset(offset + PAGE_LIMIT)}
        />
      </section>
    </div>
  );
}
