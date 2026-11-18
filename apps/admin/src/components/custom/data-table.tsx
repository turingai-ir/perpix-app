import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppTranslate } from "@/hooks";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTablePagination {
  page: number;
  limit: number;
  totalCount: number;
  hasNext?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data?: readonly T[];
  isLoading?: boolean;
  isError?: boolean;
  isForbidden?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  keyExtractor: (item: T, index: number) => string;
  pagination?: DataTablePagination;
  className?: string;
}

const faNumber = (num: number) => new Intl.NumberFormat("fa-IR").format(num);

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  isForbidden,
  errorMessage,
  emptyMessage,
  onRetry,
  keyExtractor,
  pagination,
  className,
}: DataTableProps<T>) {
  const { t } = useAppTranslate();

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalCount / pagination.limit))
    : 1;

  const currentStart = pagination
    ? Math.min(
        (pagination.page - 1) * pagination.limit + 1,
        pagination.totalCount,
      )
    : 1;

  const currentEnd = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.totalCount)
    : (data?.length ?? 0);

  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-2xl border shadow-xs",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((col) => (
              <TableHead
                key={col.id}
                className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  col.headerClassName,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="text-primary size-7 animate-spin" />
                  <p className="text-muted-foreground text-sm">
                    {t("common.table.loading", {
                      defaultValue: "در حال بارگذاری داده‌ها...",
                    })}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : isForbidden ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-3 p-4">
                  <span className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
                    <ShieldAlert className="size-6" />
                  </span>
                  <div>
                    <p className="text-foreground font-semibold">
                      {t("common.fetchErrors.forbidden", {
                        defaultValue: "عدم دسترسی",
                      })}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {t("common.table.forbiddenHint", {
                        defaultValue:
                          "شما مجوزهای لازم برای مشاهده این اطلاعات را ندارید.",
                      })}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-3 p-4">
                  <span className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
                    <AlertCircle className="size-6" />
                  </span>
                  <div>
                    <p className="text-foreground font-medium">
                      {errorMessage ||
                        t("common.table.error", {
                          defaultValue: "خطا در دریافت اطلاعات",
                        })}
                    </p>
                    {onRetry && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 gap-1.5"
                        onClick={onRetry}
                      >
                        <RefreshCw className="size-3.5" />
                        {t("common.table.retry", {
                          defaultValue: "تلاش دوباره",
                        })}
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-3 p-4">
                  <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl">
                    <Inbox className="size-6" />
                  </span>
                  <p className="text-muted-foreground text-sm">
                    {emptyMessage ||
                      t("common.table.empty", {
                        defaultValue: "موردی برای نمایش وجود ندارد",
                      })}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, idx) => (
              <TableRow key={keyExtractor(item, idx)}>
                {columns.map((col) => (
                  <TableCell key={col.id} className={col.className}>
                    {col.cell(item, idx)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination &&
        pagination.totalCount > 0 &&
        !isLoading &&
        !isError &&
        !isForbidden && (
          <div className="border-border bg-card/50 flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3 text-xs sm:px-6">
            <div className="text-muted-foreground flex items-center gap-2">
              <span>
                {t("common.table.showingItems", {
                  from: faNumber(currentStart),
                  to: faNumber(currentEnd),
                  total: faNumber(pagination.totalCount),
                  defaultValue: `نمایش ${faNumber(currentStart)} تا ${faNumber(currentEnd)} از ${faNumber(pagination.totalCount)} مورد`,
                })}
              </span>

              {pagination.onLimitChange && (
                <div className="mr-3 flex items-center gap-1.5">
                  <span className="text-muted-foreground">
                    {t("common.table.perPage", {
                      defaultValue: "تعداد در صفحه:",
                    })}
                  </span>
                  <Select
                    value={pagination.limit}
                    onChange={(e) =>
                      pagination.onLimitChange?.(Number(e.target.value))
                    }
                    className="h-7 w-18 px-2 py-0 text-xs"
                  >
                    {(pagination.limitOptions || [10, 20, 50, 100]).map(
                      (size) => (
                        <option key={size} value={size}>
                          {faNumber(size)}
                        </option>
                      ),
                    )}
                  </Select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                {t("common.table.pageOf", {
                  current: faNumber(pagination.page),
                  total: faNumber(totalPages),
                  defaultValue: `صفحه ${faNumber(pagination.page)} از ${faNumber(totalPages)}`,
                })}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={pagination.page <= 1}
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  aria-label={t("common.table.prevPage", {
                    defaultValue: "صفحه قبل",
                  })}
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={pagination.page >= totalPages}
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  aria-label={t("common.table.nextPage", {
                    defaultValue: "صفحه بعد",
                  })}
                >
                  <ChevronLeft className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
