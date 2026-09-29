import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SchemaPaymentHistoryItemResponse } from "@/services/api";
import { PaymentHistoryRow } from "@/features/payments";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { usePayments } from "@/feature/payment";
import { PaginationFooter } from "@/pages/profile/_components/pagination-footer";
import {
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/pages/profile/_components/profile-list-state";

const PAGE_LIMIT = 100;

function ProfilePaymentsPage() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = Number(searchParams.get("offset") ?? 0);
  const safeOffset = Number.isFinite(offset) && offset > 0 ? offset : 0;
  const paymentsState = usePayments({ offset: safeOffset, limit: PAGE_LIMIT });
  const payments = useMemo(
    () =>
      paymentsState.data?.items
        ? Array.from(
            paymentsState.data
              .items as ArrayLike<SchemaPaymentHistoryItemResponse>,
          )
        : [],
    [paymentsState.data],
  );

  const goToOffset = (nextOffset: number) => {
    setSearchParams({ offset: String(Math.max(0, nextOffset)) });
  };

  return (
    <Card className="min-h-full">
      <CardHeader>
        <CardTitle>{t("pages.profile.payments.title")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {paymentsState.isLoading ? <ProfileListLoading /> : null}
        {paymentsState.isError ? (
          <ProfileListError onRetry={() => paymentsState.refetch()} />
        ) : null}
        {paymentsState.isSuccess && payments.length === 0 ? (
          <ProfileListEmpty title={t("pages.profile.payments.empty")} />
        ) : null}
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-right [&>th]:font-medium">
                  <th>{t("pages.profile.payments.trackingCode")}</th>
                  <th>{t("pages.profile.payments.financialTitle")}</th>
                  <th>{t("pages.profile.payments.fulfillmentTitle")}</th>
                  <th>{t("pages.profile.payments.amount")}</th>
                  <th>{t("pages.profile.payments.type")}</th>
                  <th>{t("pages.profile.payments.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {payments.map((item) => (
                  <PaymentHistoryRow key={item.payment.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <PaginationFooter
          offset={safeOffset}
          limit={PAGE_LIMIT}
          hasNext={paymentsState.data?.has_next ?? false}
          isFetching={paymentsState.isFetching}
          onPrevious={() => goToOffset(safeOffset - PAGE_LIMIT)}
          onNext={() => goToOffset(safeOffset + PAGE_LIMIT)}
        />
      </CardContent>
    </Card>
  );
}

export default ProfilePaymentsPage;
