import { useDeferredValue, useState } from "react";
import { useSearchParams } from "react-router";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useWalletTransactions } from "@/features/wallet";
import { useAppTranslate } from "@/shared/hooks";
import { FinanceToolbar } from "@/pages/profile/_components/finance-toolbar";
import { PaginationFooter } from "@/pages/profile/_components/pagination-footer";
import {
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/pages/profile/_components/profile-list-state";
import {
  WalletTransactionTypeEnumMap,
  type SchemaWalletTransactionTypeEnum,
} from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatLocalizedNumber } from "@/shared/utils";

import { WalletHero } from "./_components/wallet-hero";
import { WalletRecords } from "./_components/wallet-records";
import { WalletSummary } from "./_components/wallet-summary";
import {
  FINANCE_ARCHIVE_CLASS,
  FINANCE_ARCHIVE_HEADING_CLASS,
  FINANCE_PAGE_CLASS,
  FINANCE_PAGE_WALLET_CLASS,
} from "../_components/finance-styles";

const PAGE_LIMIT = 10;
const transactionFilters = [
  "all",
  WalletTransactionTypeEnumMap.DEPOSIT,
  WalletTransactionTypeEnumMap.WITHDRAW,
  WalletTransactionTypeEnumMap.REFUND,
] as const;

function ProfileWalletTransactionsPage() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const requestedOffset = Number(searchParams.get("offset") ?? 0);
  const offset =
    Number.isSafeInteger(requestedOffset) && requestedOffset > 0
      ? requestedOffset
      : 0;
  const requestedType = searchParams.get("type") ?? "all";
  const activeFilter = transactionFilters.includes(
    requestedType as (typeof transactionFilters)[number],
  )
    ? requestedType
    : "all";
  const type =
    activeFilter === "all"
      ? undefined
      : (activeFilter as SchemaWalletTransactionTypeEnum);
  const transactionsState = useWalletTransactions({
    type,
    offset,
    limit: PAGE_LIMIT,
  });
  const transactions = Array.from(transactionsState.data?.transactions ?? []);
  const visibleTransactions = transactions.filter((transaction) =>
    transaction.transaction_uuid.toLowerCase().includes(deferredSearch),
  );

  const updatePage = (nextOffset: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("offset", String(Math.max(0, nextOffset)));
    setSearchParams(next);
  };
  const updateFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    value === "all" ? next.delete("type") : next.set("type", value);
    next.delete("offset");
    setSearchParams(next);
  };

  return (
    <div
      className={cn(FINANCE_PAGE_CLASS, FINANCE_PAGE_WALLET_CLASS)}
      data-finance-page="wallet"
    >
      <WalletHero />
      <WalletSummary transactions={transactions} />
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
          onClear={() => {
            setSearch("");
            updateFilter("all");
          }}
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
            onPrevious={() => updatePage(offset - PAGE_LIMIT)}
            onNext={() => updatePage(offset + PAGE_LIMIT)}
          />
        ) : null}
      </section>
    </div>
  );
}

export default ProfileWalletTransactionsPage;
