import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PaymentStatusEnumMap,
  type SchemaPaymentListItemResponse,
} from "@/services/api";
import { dayjs } from "@/lib/dayjs";
import { formatLocalizedNumber } from "@/utils";
import { usePayments } from "@/feature/payment";
import { PaginationFooter } from "@/pages/profile/_components/pagination-footer";
import {
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/pages/profile/_components/profile-list-state";

const PAGE_LIMIT = 100;

const paymentStatusLabels = {
  [PaymentStatusEnumMap.PENDING]: "در انتظار",
  [PaymentStatusEnumMap.PAID]: "پرداخت شده",
  [PaymentStatusEnumMap.FAILED]: "ناموفق",
};

function ProfilePaymentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = Number(searchParams.get("offset") ?? 0);
  const safeOffset = Number.isFinite(offset) && offset > 0 ? offset : 0;
  const paymentsState = usePayments({ offset: safeOffset, limit: PAGE_LIMIT });
  const payments = useMemo(
    () =>
      paymentsState.data
        ? Array.from(
            paymentsState.data
              .items as ArrayLike<SchemaPaymentListItemResponse>,
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
        <CardTitle>پرداخت‌ها</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {paymentsState.isLoading ? <ProfileListLoading /> : null}
        {paymentsState.isError ? (
          <ProfileListError onRetry={() => paymentsState.refetch()} />
        ) : null}
        {paymentsState.isSuccess && payments.length === 0 ? (
          <ProfileListEmpty title="پرداختی برای نمایش وجود ندارد" />
        ) : null}
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-right [&>th]:font-medium">
                  <th>کد پیگیری</th>
                  <th>وضعیت</th>
                  <th>مبلغ اولیه</th>
                  <th>مالیات</th>
                  <th>مبلغ نهایی</th>
                  <th>نوع</th>
                  <th>تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {payments.map((payment) => (
                  <tr
                    key={payment.payment_uuid}
                    className="[&>td]:px-4 [&>td]:py-3"
                  >
                    <td dir="ltr" className="text-foreground font-mono text-xs">
                      {payment.payment_uuid}
                    </td>
                    <td>
                      <Badge
                        variant={
                          payment.status === PaymentStatusEnumMap.PAID
                            ? "default"
                            : payment.status === PaymentStatusEnumMap.FAILED
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {paymentStatusLabels[payment.status]}
                      </Badge>
                    </td>
                    <td>
                      {formatLocalizedNumber({
                        value: payment.amount_irr_without_tax,
                      })}{" "}
                      ریال
                    </td>
                    <td>
                      {formatLocalizedNumber({ value: payment.tax_amount_irr })}{" "}
                      ریال
                    </td>
                    <td className="font-medium">
                      {formatLocalizedNumber({
                        value: payment.total_amount_irr,
                      })}{" "}
                      ریال
                    </td>
                    <td>{payment.target_type ?? "-"}</td>
                    <td>
                      {dayjs(payment.created_at)
                        .calendar("jalali")
                        .format("YYYY/MM/DD HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </CardContent>
      <PaginationFooter
        offset={safeOffset}
        limit={PAGE_LIMIT}
        hasNext={paymentsState.data?.has_next ?? false}
        isFetching={paymentsState.isFetching}
        onPrevious={() => goToOffset(safeOffset - PAGE_LIMIT)}
        onNext={() => goToOffset(safeOffset + PAGE_LIMIT)}
      />
    </Card>
  );
}

export default ProfilePaymentsPage;
