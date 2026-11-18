import type { FC } from "react";
import { Button } from "@/shared/ui/button";
import { formatLocalizedNumber } from "@/shared/utils";
import {
  FINANCE_ARCHIVE_CLASS,
  FINANCE_ARCHIVE_HEADING_CLASS,
  FinanceToolbar,
  PaginationFooter,
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/shared/components/finance";
import { PaymentRecords } from "./payment-records";
import {
  PAYMENT_PAGE_LIMIT,
  paymentFilters,
  type usePaymentsPage,
} from "../../hooks/use-payments-page";

type PaymentArchiveProps = ReturnType<typeof usePaymentsPage>;

export const PaymentArchive: FC<PaymentArchiveProps> = ({
  t,
  offset,
  search,
  setSearch,
  activeFilter,
  paymentsState,
  payments,
  visiblePayments,
  setDetailsId,
  updatePage,
  updateFilter,
  clearFilters,
}) => {
  return (
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
        onClear={clearFilters}
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
          onPrevious={() => updatePage(offset - PAYMENT_PAGE_LIMIT)}
          onNext={() => updatePage(offset + PAYMENT_PAGE_LIMIT)}
        />
      ) : null}
    </section>
  );
};
