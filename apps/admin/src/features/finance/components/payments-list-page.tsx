import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  CreditCard,
  Copy,
  Check,
  Eye,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  usePaymentsList,
  type PaymentsRowItem,
} from "../hooks/use-payments-list";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";
import { cn } from "@/lib/utils";
import type {
  AdminSort,
  FinancialStatusEnum,
  PaymentTargetTypeEnum,
} from "../model/types";

const faNumber = (val: number) => new Intl.NumberFormat("fa-IR").format(val);

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

export function PaymentsListPage() {
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
    financial_status?: FinancialStatusEnum;
    target_type?: PaymentTargetTypeEnum;
    user_uuid?: string;
  }>({
    defaultLimit: 20,
    defaultSort: "-created_at",
  });

  const queryParams = useMemo(
    () => ({
      offset,
      limit,
      sort: sort as AdminSort,
      tracking_code: search || undefined,
      financial_status: filters.financial_status,
      target_type: filters.target_type,
      user_uuid: filters.user_uuid,
    }),
    [offset, limit, sort, search, filters],
  );

  const { data, isPending, isError, error, refetch } =
    usePaymentsList(queryParams);

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasActiveFilters = Boolean(
    search ||
    filters.financial_status ||
    filters.target_type ||
    filters.user_uuid ||
    sort !== "-created_at",
  );

  const renderStatusBadge = useCallback(
    (status: string) => {
      switch (status) {
        case "SUCCEEDED":
          return (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              {t("features.finance.payments.statusLabels.SUCCEEDED", {
                defaultValue: "موفق",
              })}
            </Badge>
          );
        case "FAILED":
          return (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="size-3" />
              {t("features.finance.payments.statusLabels.FAILED", {
                defaultValue: "ناموفق",
              })}
            </Badge>
          );
        case "PENDING":
        case "PROCESSING":
          return (
            <Badge variant="warning" className="gap-1">
              <Clock className="size-3" />
              {t(`features.finance.payments.statusLabels.${status}`, {
                defaultValue:
                  status === "PENDING" ? "در انتظار" : "در حال پردازش",
              })}
            </Badge>
          );
        case "REQUIRES_REVIEW":
          return (
            <Badge variant="default" className="gap-1 bg-purple-600 text-white">
              <AlertTriangle className="size-3" />
              {t("features.finance.payments.statusLabels.REQUIRES_REVIEW", {
                defaultValue: "نیازمند بررسی",
              })}
            </Badge>
          );
        case "CLOSED":
          return (
            <Badge variant="muted" className="gap-1">
              <XCircle className="size-3" />
              {t("features.finance.payments.statusLabels.CLOSED", {
                defaultValue: "بسته شده",
              })}
            </Badge>
          );
        default:
          return (
            <Badge variant="muted">
              {t(`features.finance.payments.statusLabels.${status}`, {
                defaultValue: status,
              })}
            </Badge>
          );
      }
    },
    [t],
  );

  const columns: DataTableColumn<PaymentsRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.finance.payments.columns.id", {
          defaultValue: "شناسه پرداخت",
        }),
        cell: (item) => {
          const isCopied = copiedId === item.uuid;
          return (
            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <span title={item.uuid}>
                {item.uuid.slice(0, 8)}…{item.uuid.slice(-4)}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(item.uuid)}
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
        id: "user_uuid",
        header: t("features.finance.payments.columns.user", {
          defaultValue: "کاربر",
        }),
        cell: (item) => (
          <Link
            to={`/users/${item.user_uuid}`}
            className="text-primary font-mono text-xs hover:underline"
            title={item.user_uuid}
          >
            {item.user_uuid.slice(0, 8)}…
          </Link>
        ),
      },
      {
        id: "target_type",
        header: t("features.finance.payments.columns.type", {
          defaultValue: "نوع",
        }),
        cell: (item) => (
          <Badge variant="secondary">
            {t(`features.finance.payments.targetLabels.${item.target_type}`, {
              defaultValue:
                item.target_type === "wallet_topup"
                  ? "شارژ کیف پول"
                  : item.target_type === "subscription"
                    ? "خرید اشتراک"
                    : item.target_type,
            })}
          </Badge>
        ),
      },
      {
        id: "amount_irr",
        header: t("features.finance.payments.columns.amount", {
          defaultValue: "مبلغ (ریال)",
        }),
        cell: (item) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold tabular-nums">
              {faNumber(item.total_irr)}{" "}
              <span className="text-muted-foreground text-xs font-normal">
                {t("common.rial", { defaultValue: "ریال" })}
              </span>
            </span>
            <UsdmicroAmount
              value={item.total_usdmicro}
              hint="inline"
              className="text-xs"
            />
          </div>
        ),
      },
      {
        id: "financial_status",
        header: t("features.finance.payments.columns.financialStatus", {
          defaultValue: "وضعیت مالی",
        }),
        cell: (item) => renderStatusBadge(item.financial_status),
      },
      {
        id: "fulfillment_status",
        header: t("features.finance.payments.columns.fulfillmentStatus", {
          defaultValue: "وضعیت تحویل",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs">
            {t(
              `features.finance.payments.fulfillmentLabels.${item.fulfillment_status}`,
              {
                defaultValue: item.fulfillment_status,
              },
            )}
          </span>
        ),
      },
      {
        id: "created_at",
        header: t("features.finance.payments.columns.date", {
          defaultValue: "تاریخ ثبت",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatDate(item.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("features.finance.payments.columns.actions", {
          defaultValue: "عملیات",
        }),
        className: "text-left",
        headerClassName: "text-left",
        cell: (item) => (
          <Link
            to={`/finance/payments/${item.uuid}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs",
            )}
          >
            <Eye className="size-3.5" />
            {t("common.details", { defaultValue: "جزئیات" })}
          </Link>
        ),
      },
    ],
    [copiedId, renderStatusBadge, t],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <CreditCard aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.finance.menuTitle", { defaultValue: "مالی" })}
          </span>
          <span>/</span>
          <span className="text-foreground font-medium">
            {t("features.finance.payments.title", {
              defaultValue: "پرداخت‌ها",
            })}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("features.finance.payments.title", {
            defaultValue: "مدیریت پرداخت‌ها",
          })}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("features.finance.payments.description", {
            defaultValue:
              "مشاهده، رهگیری و بررسی وضعیت پرداخت‌ها و تراکنش‌های بانکی",
          })}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tracking code search */}
          <div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t(
                "features.finance.payments.filters.searchPlaceholder",
                {
                  defaultValue: "جستجو بر اساس کد پیگیری...",
                },
              )}
            />
          </div>

          {/* Financial Status Filter */}
          <div>
            <Select
              value={filters.financial_status || "all"}
              onChange={(e) => setFilter("financial_status", e.target.value)}
              aria-label="فیلتر وضعیت مالی"
            >
              <option value="all">
                {t("features.finance.payments.filters.allStatuses", {
                  defaultValue: "همه وضعیت‌ها",
                })}
              </option>
              <option value="SUCCEEDED">
                {t("features.finance.payments.statusLabels.SUCCEEDED", {
                  defaultValue: "موفق",
                })}
              </option>
              <option value="PENDING">
                {t("features.finance.payments.statusLabels.PENDING", {
                  defaultValue: "در انتظار",
                })}
              </option>
              <option value="CLOSED">
                {t("features.finance.payments.statusLabels.CLOSED", {
                  defaultValue: "بسته شده",
                })}
              </option>
            </Select>
          </div>

          {/* Target Type Filter */}
          <div>
            <Select
              value={filters.target_type || "all"}
              onChange={(e) => setFilter("target_type", e.target.value)}
              aria-label="فیلتر نوع پرداخت"
            >
              <option value="all">
                {t("features.finance.payments.filters.allTypes", {
                  defaultValue: "همه انواع",
                })}
              </option>
              <option value="wallet_topup">
                {t("features.finance.payments.targetLabels.wallet_topup", {
                  defaultValue: "شارژ کیف پول",
                })}
              </option>
              <option value="subscription">
                {t("features.finance.payments.targetLabels.subscription", {
                  defaultValue: "اشتراک",
                })}
              </option>
            </Select>
          </div>

          {/* Sort Filter */}
          <div>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="مرتب‌سازی"
            >
              <option value="-created_at">
                {t("features.finance.payments.filters.sortNewest", {
                  defaultValue: "جدیدترین ابتدا",
                })}
              </option>
              <option value="created_at">
                {t("features.finance.payments.filters.sortOldest", {
                  defaultValue: "قدیمی‌ترین ابتدا",
                })}
              </option>
            </Select>
          </div>
        </div>

        {/* Active Filters Clear Button */}
        {hasActiveFilters && (
          <div className="border-border/60 flex items-center justify-between border-t pt-2.5 text-xs">
            <span className="text-muted-foreground">
              {t("features.finance.payments.filters.activeFilters", {
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

      {/* Payments Table */}
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
