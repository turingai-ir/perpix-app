import { useDeferredValue, useState } from "react";
import { Radio } from "lucide-react";
import { useSearchParams } from "react-router";

import { Button } from "@/shared/ui/button";
import {
  getPaymentViewStatus,
  PaymentDetailsDialog,
  usePayments,
} from "@/features/payment";
import { useAppTranslate } from "@/shared/hooks";
import { FinanceHero } from "@/pages/profile/_components/finance-hero";
import { FinanceToolbar } from "@/pages/profile/_components/finance-toolbar";
import { PaginationFooter } from "@/pages/profile/_components/pagination-footer";
import {
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/pages/profile/_components/profile-list-state";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatLocalizedNumber } from "@/shared/utils";

import { PaymentRecords } from "./_components/payment-records";
import { PaymentSummary } from "./_components/payment-summary";
import {
  FINANCE_ARCHIVE_CLASS,
  FINANCE_ARCHIVE_HEADING_CLASS,
  FINANCE_CHIP_CLASS,
  FINANCE_PAGE_CLASS,
} from "../_components/finance-styles";

const PAGE_LIMIT = 100;
const paymentFilters = ["all", "succeeded", "pending", "failed"] as const;

function ProfilePaymentsPage() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const requestedOffset = Number(searchParams.get("offset") ?? 0);
  const offset =
    Number.isSafeInteger(requestedOffset) && requestedOffset > 0
      ? requestedOffset
      : 0;
  const requestedFilter = searchParams.get("status") ?? "all";
  const activeFilter = paymentFilters.includes(
    requestedFilter as (typeof paymentFilters)[number],
  )
    ? requestedFilter
    : "all";
  const paymentsState = usePayments({ offset, limit: PAGE_LIMIT });
  const payments = Array.from(paymentsState.data?.items ?? []);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const visiblePayments = payments.filter(({ payment, target_type }) => {
    const status = getPaymentViewStatus(payment);
    const matchesStatus =
      activeFilter === "all" ||
      activeFilter === status ||
      (activeFilter === "pending" && ["processing", "review"].includes(status));
    const haystack =
      `${payment.id} ${payment.execution_uuid} ${target_type}`.toLowerCase();
    return matchesStatus && haystack.includes(deferredSearch);
  });

  const updatePage = (nextOffset: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("offset", String(Math.max(0, nextOffset)));
    setSearchParams(next);
  };
  const updateFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    value === "all" ? next.delete("status") : next.set("status", value);
    next.delete("offset");
    setSearchParams(next);
  };

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
      <section
        className={FINANCE_ARCHIVE_CLASS}
        data-finance-archive
        aria-labelledby="payment-archive-title"
      >
        <div className={FINANCE_ARCHIVE_HEADING_CLASS}>
          <div>
            <h2 id="payment-archive-title">
              {t("pages.profile.finance.paymentArchive")}
            </h2>
            <p>{t("pages.profile.finance.pageScope")}</p>
          </div>
        </div>
        <FinanceToolbar
          searchLabel={t("pages.profile.finance.search")}
          searchPlaceholder={t("pages.profile.finance.searchPlaceholder")}
          searchValue={search}
          filtersLabel={t("pages.profile.finance.filters")}
          filters={paymentFilters.map((value) => ({
            value,
            label:
              value === "all"
                ? t("pages.profile.finance.all")
                : t(`pages.profile.payments.states.${value}`),
          }))}
          activeFilter={activeFilter}
          resultLabel={t("pages.profile.finance.resultCount", {
            value: formatLocalizedNumber({ value: visiblePayments.length }),
          })}
          clearLabel={t("pages.profile.finance.clearFilters")}
          onSearchChange={setSearch}
          onFilterChange={updateFilter}
          onClear={() => {
            setSearch("");
            updateFilter("all");
          }}
        />
        {paymentsState.isLoading ? <ProfileListLoading /> : null}
        {paymentsState.isError ? (
          <ProfileListError onRetry={() => void paymentsState.refetch()} />
        ) : null}
        {paymentsState.isSuccess && payments.length === 0 ? (
          <>
            <ProfileListEmpty
              title={t(
                offset > 0
                  ? "pages.profile.finance.zeroRecords"
                  : "pages.profile.finance.emptyPayments",
              )}
            />
            {offset > 0 ? (
              <div className="flex justify-center px-4 pb-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={paymentsState.isFetching}
                  onClick={() => updatePage(0)}
                >
                  {t("pages.profile.finance.firstPage")}
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
        {payments.length > 0 && visiblePayments.length === 0 ? (
          <ProfileListEmpty title={t("pages.profile.finance.noResults")} />
        ) : null}
        {visiblePayments.length > 0 ? (
          <PaymentRecords
            payments={visiblePayments}
            onOpenDetails={setDetailsId}
          />
        ) : null}
        {payments.length > 0 ? (
          <PaginationFooter
            offset={offset}
            itemCount={payments.length}
            hasNext={paymentsState.data?.has_next ?? false}
            isFetching={paymentsState.isFetching}
            onPrevious={() => updatePage(offset - PAGE_LIMIT)}
            onNext={() => updatePage(offset + PAGE_LIMIT)}
          />
        ) : null}
      </section>
      {detailsId ? (
        <PaymentDetailsDialog
          intentUuid={detailsId}
          onClose={() => setDetailsId(null)}
        />
      ) : null}
    </div>
  );
}

export default ProfilePaymentsPage;
