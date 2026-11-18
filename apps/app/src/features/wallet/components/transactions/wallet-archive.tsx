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
import { WalletRecords } from "./wallet-records";
import {
  WALLET_PAGE_LIMIT,
  transactionFilters,
  type useWalletTransactionsPage,
} from "../../hooks/use-wallet-transactions-page";

type WalletArchiveProps = ReturnType<typeof useWalletTransactionsPage>;

export const WalletArchive: FC<WalletArchiveProps> = ({
  t,
  offset,
  search,
  setSearch,
  activeFilter,
  transactionsState,
  transactions,
  visibleTransactions,
  updatePage,
  updateFilter,
  clearFilters,
}) => {
  return (
    <section
      className={FINANCE_ARCHIVE_CLASS}
      data-finance-archive
      aria-labelledby="wallet-archive-title"
    >
      <div className={FINANCE_ARCHIVE_HEADING_CLASS}>
        <div>
          <h2 id="wallet-archive-title">
            {t("pages.profile.finance.walletArchive")}
          </h2>
          <p>{t("pages.profile.finance.pageScope")}</p>
        </div>
      </div>
      <FinanceToolbar
        searchLabel={t("pages.profile.finance.search")}
        searchPlaceholder={t("pages.profile.finance.searchPlaceholder")}
        searchValue={search}
        filtersLabel={t("pages.profile.finance.filters")}
        filters={transactionFilters.map((value) => ({
          value,
          label:
            value === "all"
              ? t("pages.profile.finance.all")
              : t(`pages.profile.finance.${value}`),
        }))}
        activeFilter={activeFilter}
        resultLabel={t("pages.profile.finance.resultCount", {
          value: formatLocalizedNumber({ value: visibleTransactions.length }),
        })}
        clearLabel={t("pages.profile.finance.clearFilters")}
        onSearchChange={setSearch}
        onFilterChange={updateFilter}
        onClear={clearFilters}
      />
      {transactionsState.isLoading ? <ProfileListLoading /> : null}
      {transactionsState.isError ? (
        <ProfileListError onRetry={() => void transactionsState.refetch()} />
      ) : null}
      {transactionsState.isSuccess && transactions.length === 0 ? (
        <>
          <ProfileListEmpty
            title={t(
              offset > 0
                ? "pages.profile.finance.zeroRecords"
                : "pages.profile.finance.emptyWallet",
            )}
          />
          {offset > 0 ? (
            <div className="flex justify-center px-4 pb-6">
              <Button
                type="button"
                variant="outline"
                disabled={transactionsState.isFetching}
                onClick={() => updatePage(0)}
              >
                {t("pages.profile.finance.firstPage")}
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
      {transactions.length > 0 && visibleTransactions.length === 0 ? (
        <ProfileListEmpty title={t("pages.profile.finance.noResults")} />
      ) : null}
      {visibleTransactions.length > 0 ? (
        <WalletRecords transactions={visibleTransactions} />
      ) : null}
      {transactions.length > 0 ? (
        <PaginationFooter
          offset={offset}
          itemCount={transactions.length}
          hasNext={transactionsState.data?.has_next ?? false}
          isFetching={transactionsState.isFetching}
          onPrevious={() => updatePage(offset - WALLET_PAGE_LIMIT)}
          onNext={() => updatePage(offset + WALLET_PAGE_LIMIT)}
        />
      ) : null}
    </section>
  );
};
