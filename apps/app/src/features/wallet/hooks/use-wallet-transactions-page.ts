import { useDeferredValue, useState } from "react";
import { useSearchParams } from "react-router";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import {
  WalletTransactionTypeEnumMap,
  type SchemaWalletTransactionResponse,
  type SchemaWalletTransactionTypeEnum,
} from "@/shared/api";
import { useWalletTransactions } from "./wallet-queries";

export const WALLET_PAGE_LIMIT = 10;
export const transactionFilters = [
  "all",
  WalletTransactionTypeEnumMap.DEPOSIT,
  WalletTransactionTypeEnumMap.WITHDRAW,
  WalletTransactionTypeEnumMap.REFUND,
] as const;
export type WalletFilterType = (typeof transactionFilters)[number];

export function useWalletTransactionsPage() {
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
    requestedType as WalletFilterType,
  )
    ? (requestedType as WalletFilterType)
    : "all";

  const type =
    activeFilter === "all"
      ? undefined
      : (activeFilter as SchemaWalletTransactionTypeEnum);

  const transactionsState = useWalletTransactions({
    type,
    offset,
    limit: WALLET_PAGE_LIMIT,
  });

  const transactions: SchemaWalletTransactionResponse[] = Array.from(
    transactionsState.data?.transactions ?? [],
  );
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
    if (value === "all") {
      next.delete("type");
    } else {
      next.set("type", value);
    }
    next.delete("offset");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearch("");
    updateFilter("all");
  };

  return {
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
  };
}
