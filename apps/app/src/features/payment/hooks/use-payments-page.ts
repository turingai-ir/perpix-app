import { useDeferredValue, useState } from "react";
import { useSearchParams } from "react-router";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import type { SchemaPaymentHistoryItemResponse } from "@/shared/api";
import { usePayments } from "./payment-queries";
import { getPaymentViewStatus } from "../model/payment-status";

export const PAYMENT_PAGE_LIMIT = 100;
export const paymentFilters = [
  "all",
  "succeeded",
  "pending",
  "failed",
] as const;
export type PaymentFilterType = (typeof paymentFilters)[number];

export function usePaymentsPage() {
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
    requestedFilter as PaymentFilterType,
  )
    ? (requestedFilter as PaymentFilterType)
    : "all";

  const paymentsState = usePayments({ offset, limit: PAYMENT_PAGE_LIMIT });
  const payments: SchemaPaymentHistoryItemResponse[] = Array.from(
    paymentsState.data?.items ?? [],
  );
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
    if (value === "all") {
      next.delete("status");
    } else {
      next.set("status", value);
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
    paymentsState,
    payments,
    visiblePayments,
    detailsId,
    setDetailsId,
    updatePage,
    updateFilter,
    clearFilters,
  };
}
