import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Receipt,
  Copy,
  Check,
  RotateCcw,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";
import {
  useTransactionsList,
  type TransactionsRowItem,
} from "../hooks/use-transactions-list";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import {
  BalanceChange,
  UsdmicroAmount,
} from "@/components/custom/usdmicro-amount";
import type {
  AdminSort,
  WalletTransactionTypeEnum,
  WalletOperationSourceEnum,
} from "../model/types";

const formatDate = (isoString?: string | null) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export function TransactionsListPage() {
  const { t } = useAppTranslate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    page,
    limit,
    offset,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    resetFilters,
  } = useTableQuery<{
    type?: WalletTransactionTypeEnum;
    source?: WalletOperationSourceEnum;
    direction?: "credit" | "debit";
  }>({
    defaultLimit: 20,
    defaultSort: "-created_at",
  });

  const queryParams = useMemo(
    () => ({
      offset,
      limit,
      sort: sort as AdminSort,
      search: search || undefined,
      type: filters.type,
      source: filters.source,
      direction: filters.direction,
    }),
    [offset, limit, sort, search, filters],
  );

  const { data, isPending, isError, error, refetch } =
    useTransactionsList(queryParams);

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasActiveFilters = Boolean(
    search ||
    filters.type ||
    filters.source ||
    filters.direction ||
    sort !== "-created_at",
  );

  const columns: DataTableColumn<TransactionsRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.finance.transactions.columns.id", {
          defaultValue: "شناسه تراکنش",
        }),
        cell: (tx) => {
          const isCopied = copiedId === tx.uuid;
          return (
            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <span title={tx.uuid}>
                {tx.uuid.slice(0, 8)}…{tx.uuid.slice(-4)}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(tx.uuid)}
                aria-label="کپی شناسه"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
              >
                {isCopied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        id: "wallet_uuid",
        header: t("features.finance.transactions.columns.wallet", {
          defaultValue: "کیف پول",
        }),
        cell: (tx) => (
          <Link
            to={`/finance/wallets/${tx.wallet_uuid}`}
            className="text-primary font-mono text-xs hover:underline"
            title={tx.wallet_uuid}
          >
            {tx.wallet_uuid.slice(0, 8)}…
          </Link>
        ),
      },
      {
        id: "user_uuid",
        header: t("features.finance.transactions.columns.user", {
          defaultValue: "کاربر",
        }),
        cell: (tx) => (
          <Link
            to={`/users/${tx.user_uuid}`}
            className="text-primary font-mono text-xs hover:underline"
            title={tx.user_uuid}
          >
            {tx.user_uuid.slice(0, 8)}…
          </Link>
        ),
      },
      {
        id: "type",
        header: t("features.finance.transactions.columns.type", {
          defaultValue: "نوع",
        }),
        cell: (tx) => {
          if (tx.type === "DEPOSIT") {
            return (
              <Badge variant="success" className="gap-1">
                <ArrowDownLeft className="size-3" />
                {t("features.finance.transactions.typeLabels.DEPOSIT", {
                  defaultValue: "واریز",
                })}
              </Badge>
            );
          }
          if (tx.type === "WITHDRAW") {
            return (
              <Badge variant="destructive" className="gap-1">
                <ArrowUpRight className="size-3" />
                {t("features.finance.transactions.typeLabels.WITHDRAW", {
                  defaultValue: "برداشت",
                })}
              </Badge>
            );
          }
          return (
            <Badge variant="warning" className="gap-1">
              <RefreshCw className="size-3" />
              {t("features.finance.transactions.typeLabels.REFUND", {
                defaultValue: "استرداد",
              })}
            </Badge>
          );
        },
      },
      {
        id: "source",
        header: t("features.finance.transactions.columns.source", {
          defaultValue: "منبع تراکنش",
        }),
        cell: (tx) => (
          <Badge variant="outline" className="text-xs">
            {t(`features.finance.transactions.sourceLabels.${tx.source}`, {
              defaultValue: tx.source,
            })}
          </Badge>
        ),
      },
      {
        id: "amount",
        header: t("features.finance.transactions.columns.amount", {
          defaultValue: "مبلغ",
        }),
        cell: (tx) => {
          const isPositive = tx.type === "DEPOSIT" || tx.type === "REFUND";
          return (
            <span className="flex items-baseline gap-0.5 text-sm font-semibold">
              <span
                className={isPositive ? "text-emerald-600" : "text-destructive"}
              >
                {isPositive ? "+" : "-"}
              </span>
              <UsdmicroAmount
                value={tx.amount_usdmicro ?? 0}
                amountClassName={
                  isPositive ? "text-emerald-600" : "text-destructive"
                }
              />
            </span>
          );
        },
      },
      {
        id: "balance_change",
        header: t("features.finance.transactions.columns.balanceChange", {
          defaultValue: "مانده موجودی",
        }),
        cell: (tx) => (
          <BalanceChange
            before={tx.balance_before ?? 0}
            after={tx.balance_after ?? 0}
          />
        ),
      },
      {
        id: "created_at",
        header: t("features.finance.transactions.columns.date", {
          defaultValue: "تاریخ",
        }),
        cell: (tx) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatDate(tx.created_at)}
          </span>
        ),
      },
    ],
    [copiedId, t],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Receipt aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.finance.menuTitle", { defaultValue: "مالی" })}
          </span>
          <span>/</span>
          <span className="text-foreground font-medium">
            {t("features.finance.transactions.title", {
              defaultValue: "تراکنش‌ها",
            })}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("features.finance.transactions.title", {
            defaultValue: "تراکنش‌های کیف پول",
          })}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("features.finance.transactions.description", {
            defaultValue:
              "مشاهده و پیگیری سوابق تراکنش‌های شارژ، مصرف و بازگشت اعتبار",
          })}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t(
                "features.finance.transactions.filters.searchPlaceholder",
                {
                  defaultValue: "جستجو در توضیحات یا شناسه‌ها...",
                },
              )}
            />
          </div>

          {/* Type Filter */}
          <div>
            <Select
              value={filters.type || "all"}
              onChange={(e) => setFilter("type", e.target.value)}
              aria-label="فیلتر نوع تراکنش"
            >
              <option value="all">
                {t("features.finance.transactions.filters.allTypes", {
                  defaultValue: "همه انواع",
                })}
              </option>
              <option value="DEPOSIT">واریز (DEPOSIT)</option>
              <option value="WITHDRAW">برداشت (WITHDRAW)</option>
              <option value="REFUND">استرداد (REFUND)</option>
            </Select>
          </div>

          {/* Source Filter */}
          <div>
            <Select
              value={filters.source || "all"}
              onChange={(e) => setFilter("source", e.target.value)}
              aria-label="فیلتر منبع تراکنش"
            >
              <option value="all">
                {t("features.finance.transactions.filters.allSources", {
                  defaultValue: "همه منابع",
                })}
              </option>
              <option value="admin">ادمین (admin)</option>
              <option value="ai_gateway_request">درخواست Gateway</option>
              <option value="ai_task_message">وظیفه هوش مصنوعی</option>
              <option value="subscription">خرید اشتراک</option>
            </Select>
          </div>

          {/* Sort Filter */}
          <div>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="مرتب‌سازی"
            >
              <option value="-created_at">جدیدترین ابتدا</option>
              <option value="created_at">قدیمی‌ترین ابتدا</option>
            </Select>
          </div>
        </div>

        {/* Active Filters Clear Button */}
        {hasActiveFilters && (
          <div className="border-border/60 flex items-center justify-between border-t pt-2.5 text-xs">
            <span className="text-muted-foreground">
              {t("features.finance.transactions.filters.activeFilters", {
                defaultValue: "فیلترها اعمال شده‌اند",
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground h-7 gap-1 text-xs"
            >
              <RotateCcw className="size-3" />
              {t("common.resetFilters", {
                defaultValue: "پاک کردن همه فیلترها",
              })}
            </Button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <DataTable
        columns={columns}
        data={data?.items ? Array.from(data.items) : undefined}
        isLoading={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch();
        }}
        keyExtractor={(item) => item.uuid}
        pagination={{
          page,
          limit,
          totalCount: data?.total_count ?? 0,
          hasNext: data?.has_next,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
      />
    </div>
  );
}
