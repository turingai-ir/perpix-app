import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WalletTransactionTypeEnumMap,
  type SchemaWalletTransactionResponse,
} from "@/services/api";
import { dayjs } from "@/lib/dayjs";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";
import { useWalletTransactions } from "@/feature/wallet";
import { PaginationFooter } from "@/pages/profile/_components/pagination-footer";
import {
  ProfileListEmpty,
  ProfileListError,
  ProfileListLoading,
} from "@/pages/profile/_components/profile-list-state";

const PAGE_LIMIT = 100;

const transactionTypeLabels = {
  [WalletTransactionTypeEnumMap.DEPOSIT]: "واریز",
  [WalletTransactionTypeEnumMap.WITHDRAW]: "برداشت",
  [WalletTransactionTypeEnumMap.REFUND]: "بازگشت",
};

function ProfileWalletTransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = Number(searchParams.get("offset") ?? 0);
  const safeOffset = Number.isFinite(offset) && offset > 0 ? offset : 0;
  const transactionsState = useWalletTransactions({
    offset: safeOffset,
    limit: PAGE_LIMIT,
  });
  const transactions = useMemo(
    () =>
      transactionsState.data
        ? Array.from(
            transactionsState.data
              .transactions as ArrayLike<SchemaWalletTransactionResponse>,
          )
        : [],
    [transactionsState.data],
  );

  const goToOffset = (nextOffset: number) => {
    setSearchParams({ offset: String(Math.max(0, nextOffset)) });
  };

  return (
    <Card className="min-h-full">
      <CardHeader>
        <CardTitle>تراکنش‌های کیف پول</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactionsState.isLoading ? <ProfileListLoading /> : null}
        {transactionsState.isError ? (
          <ProfileListError onRetry={() => transactionsState.refetch()} />
        ) : null}
        {transactionsState.isSuccess && transactions.length === 0 ? (
          <ProfileListEmpty title="تراکنشی برای نمایش وجود ندارد" />
        ) : null}
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-right [&>th]:font-medium">
                  <th>کد تراکنش</th>
                  <th>نوع</th>
                  <th>مبلغ</th>
                  <th>موجودی قبل</th>
                  <th>موجودی بعد</th>
                  <th>تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.transaction_uuid}
                    className="[&>td]:px-4 [&>td]:py-3"
                  >
                    <td dir="ltr" className="text-foreground font-mono text-xs">
                      {transaction.transaction_uuid}
                    </td>
                    <td>
                      <Badge
                        variant={
                          transaction.type ===
                          WalletTransactionTypeEnumMap.WITHDRAW
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {transactionTypeLabels[transaction.type]}
                      </Badge>
                    </td>
                    <td className="font-medium">
                      {formatLocalizedNumber({
                        value: microDollarToToken(transaction.amount_usdmicro),
                      })}
                    </td>
                    <td>
                      {formatLocalizedNumber({
                        value: microDollarToToken(transaction.balance_before),
                      })}
                    </td>
                    <td>
                      {formatLocalizedNumber({
                        value: microDollarToToken(transaction.balance_after),
                      })}
                    </td>
                    <td>
                      {dayjs(transaction.created_at)
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
        hasNext={transactionsState.data?.has_next ?? false}
        isFetching={transactionsState.isFetching}
        onPrevious={() => goToOffset(safeOffset - PAGE_LIMIT)}
        onNext={() => goToOffset(safeOffset + PAGE_LIMIT)}
      />
    </Card>
  );
}

export default ProfileWalletTransactionsPage;
