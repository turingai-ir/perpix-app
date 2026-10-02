import { useSearchParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayments, getPaymentViewStatus } from "@/feature/payment";
import { useAppTranslate } from "@/hooks";
import { dayjs } from "@/lib/dayjs";
import { PaginationFooter } from "@/pages/profile/_components/pagination-footer";
import {
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/pages/profile/_components/profile-list-state";
import { APP_I18_KEYS } from "@/services/i18";
import type { SchemaPaymentHistoryItemResponse } from "@/services/api";
import { PaymentAmount } from "@/features/payment";

const PAGE_LIMIT = 100;

function ProfilePaymentsPage() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = Number(searchParams.get("offset") ?? 0);
  const safeOffset = Number.isFinite(offset) && offset > 0 ? offset : 0;
  const paymentsState = usePayments({ offset: safeOffset, limit: PAGE_LIMIT });
  const payments: SchemaPaymentHistoryItemResponse[] = paymentsState.data?.items
    ? Array.from(
        paymentsState.data.items as ArrayLike<SchemaPaymentHistoryItemResponse>,
      )
    : [];

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
                  <th>{t("pages.profile.payments.paymentStatus")}</th>
                  <th>{t("pages.profile.payments.fulfillmentStatus")}</th>
                  <th>{t("pages.profile.payments.baseAmount")}</th>
                  <th>{t("pages.profile.payments.taxAmount")}</th>
                  <th>{t("pages.profile.payments.totalAmount")}</th>
                  <th>{t("pages.profile.payments.type")}</th>
                  <th>{t("pages.profile.payments.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {payments.map(({ payment, target_type, created_at }) => {
                  const status = getPaymentViewStatus(payment);
                  return (
                    <tr key={payment.id} className="[&>td]:px-4 [&>td]:py-3">
                      <td
                        dir="ltr"
                        className="text-foreground font-mono text-xs"
                      >
                        {payment.id}
                      </td>
                      <td>
                        <Badge
                          variant={
                            status === "failed"
                              ? "destructive"
                              : status === "succeeded"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {t(`pages.profile.payments.states.${status}`)}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          variant={
                            payment.fulfillment_status === "NEEDS_REVIEW"
                              ? "destructive"
                              : payment.fulfillment_status === "SUCCEEDED"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {t(
                            `pages.profile.payments.fulfillment.${payment.fulfillment_status}`,
                          )}
                        </Badge>
                      </td>
                      <td>
                        <PaymentAmount
                          amount={payment.base_amount}
                          currency={payment.currency}
                        />
                      </td>
                      <td>
                        <PaymentAmount
                          amount={payment.tax_amount}
                          currency={payment.currency}
                        />
                      </td>
                      <td className="font-semibold">
                        <PaymentAmount
                          amount={payment.total_amount}
                          currency={payment.currency}
                        />
                      </td>
                      <td>
                        {t(`pages.profile.payments.targets.${target_type}`, {
                          defaultValue: t(
                            "pages.profile.payments.targets.other",
                          ),
                        })}
                      </td>
                      <td>
                        {dayjs(created_at)
                          .locale("fa")
                          .format("YYYY/MM/DD HH:mm")}
                      </td>
                    </tr>
                  );
                })}
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
