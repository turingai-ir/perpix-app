import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PaymentExecutionStatusMap,
  type SchemaPaymentHistoryItemResponse,
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

const paymentStatusLabels: Record<string, string> = {
  [PaymentExecutionStatusMap.SUCCEEDED]: "پرداخت شده",
  [PaymentExecutionStatusMap.PENDING]: "در انتظار",
  [PaymentExecutionStatusMap.CREATING]: "در حال ایجاد",
  [PaymentExecutionStatusMap.UNKNOWN]: "نامشخص",
  [PaymentExecutionStatusMap.FAILED]: "ناموفق",
  [PaymentExecutionStatusMap.EXPIRED]: "منقضی شده",
};

function ProfilePaymentsPage() {
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
                  <th>مبلغ</th>
                  <th>نوع</th>
                  <th>تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {payments.map(({ payment, target_type, created_at }) => (
                  <tr key={payment.id} className="[&>td]:px-4 [&>td]:py-3">
                    <td dir="ltr" className="text-foreground font-mono text-xs">
                      {payment.id}
                    </td>
                    <td>
                      <Badge
                        variant={
                          payment.status === PaymentExecutionStatusMap.SUCCEEDED
                            ? "default"
                            : payment.status === PaymentExecutionStatusMap.FAILED ||
                              payment.status === PaymentExecutionStatusMap.EXPIRED
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {paymentStatusLabels[payment.status] ?? payment.status}
                      </Badge>
                    </td>
                    <td>
                      {formatLocalizedNumber({
                        value: Number(payment.amount) || 0,
                      })}{" "}
                      ریال
                    </td>
                    <td>{target_type ?? "-"}</td>
                    <td>
                      {dayjs(created_at).locale("fa").format("YYYY/MM/DD HH:mm")}
                    </td>
                  </tr>
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
