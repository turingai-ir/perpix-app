import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Wallet,
  Copy,
  Check,
  Eye,
  PlusCircle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useWalletsList, type WalletsRowItem } from "../hooks/use-wallets-list";
import { useFinanceActions } from "../hooks/use-finance-actions";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import {
  UsdmicroAmount,
  UsdmicroInputHint,
} from "@/components/custom/usdmicro-amount";
import { parseUsdmicro } from "@/utils/usdmicro";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import type { AdminSort } from "../model/types";
import { UsdmicroInput } from "@/components/custom/usdmicro-input";

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

export function WalletsListPage() {
  const { t } = useAppTranslate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Charge wallet modal state
  const [selectedWallet, setSelectedWallet] = useState<WalletsRowItem | null>(
    null,
  );
  const [chargeAmountUsdmicro, setChargeAmountUsdmicro] = useState("1000000");
  const [chargeReason, setChargeReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const {
    page,
    limit,
    offset,
    sort,
    search,
    setPage,
    setLimit,
    setSort,
    setSearch,
  } = useTableQuery({
    defaultLimit: 20,
    defaultSort: "-created_at",
  });

  const queryParams = useMemo(
    () => ({
      offset,
      limit,
      sort: sort as AdminSort,
      user_uuid: search || undefined,
    }),
    [offset, limit, sort, search],
  );

  const { data, isPending, isError, error, refetch } =
    useWalletsList(queryParams);
  const { chargeWallet, isCharging } = useFinanceActions();

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCharge = (wallet: WalletsRowItem) => {
    setSelectedWallet(wallet);
    setChargeAmountUsdmicro("1000000");
    setChargeReason("");
    setIsConfirmed(false);
  };

  const handleChargeSubmit = async () => {
    if (!selectedWallet) return;
    const amountUsdmicro = parseUsdmicro(chargeAmountUsdmicro);
    if (amountUsdmicro === null || amountUsdmicro <= 0) return;

    try {
      await chargeWallet({
        walletUuid: selectedWallet.uuid,
        userUuid: selectedWallet.user_uuid,
        amountUsdmicro,
        reason: chargeReason.trim() || undefined,
      });
      setSelectedWallet(null);
    } catch {
      // error handled in hook
    }
  };

  const columns: DataTableColumn<WalletsRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.finance.wallets.columns.id", {
          defaultValue: "شناسه کیف پول",
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
                aria-label="کپی شناسه کیف پول"
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
        header: t("features.finance.wallets.columns.user", {
          defaultValue: "شناسه کاربر",
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
        id: "name",
        header: t("features.finance.wallets.columns.name", {
          defaultValue: "نام کیف پول",
        }),
        cell: (item) => (
          <span className="text-foreground text-sm font-medium">
            {item.name ||
              t("common.defaultWallet", { defaultValue: "کیف پول اصلی" })}
          </span>
        ),
      },
      {
        id: "balance",
        header: t("features.finance.wallets.columns.balance", {
          defaultValue: "موجودی",
        }),
        cell: (item) => (
          <UsdmicroAmount
            value={item.balance_usdmicro}
            amountClassName="text-sm font-semibold"
          />
        ),
      },
      {
        id: "is_active",
        header: t("features.finance.wallets.columns.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) =>
          item.is_active ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              {t("common.active", { defaultValue: "فعال" })}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="size-3" />
              {t("common.inactive", { defaultValue: "غیرفعال" })}
            </Badge>
          ),
      },
      {
        id: "is_locked",
        header: t("features.finance.wallets.columns.lockStatus", {
          defaultValue: "قفل حساب",
        }),
        cell: (item) =>
          item.is_locked ? (
            <Badge variant="warning" className="gap-1 text-xs">
              <Lock className="size-3" />
              {t("features.finance.wallets.locked", {
                defaultValue: "قفل شده",
              })}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground gap-1 text-xs"
            >
              <Unlock className="size-3" />
              {t("features.finance.wallets.unlocked", { defaultValue: "آزاد" })}
            </Badge>
          ),
      },
      {
        id: "created_at",
        header: t("features.finance.wallets.columns.createdAt", {
          defaultValue: "تاریخ ساخت",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {formatDate(item.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("features.finance.wallets.columns.actions", {
          defaultValue: "عملیات",
        }),
        className: "text-left",
        headerClassName: "text-left",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-emerald-500/30 text-xs text-emerald-600 hover:bg-emerald-500/10"
              onClick={() => handleOpenCharge(item)}
            >
              <PlusCircle className="size-3.5" />
              {t("features.finance.wallets.chargeBtn", {
                defaultValue: "شارژ",
              })}
            </Button>
            <Link
              to={`/finance/wallets/${item.uuid}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1 text-xs",
              )}
            >
              <Eye className="size-3.5" />
              {t("common.details", { defaultValue: "جزئیات" })}
            </Link>
          </div>
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
          <Wallet aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.finance.menuTitle", { defaultValue: "مالی" })}
          </span>
          <span>/</span>
          <span className="text-foreground font-medium">
            {t("features.finance.wallets.title", {
              defaultValue: "کیف پول‌ها",
            })}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("features.finance.wallets.title", {
            defaultValue: "مدیریت کیف پول‌ها",
          })}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("features.finance.wallets.description", {
            defaultValue: "مشاهده موجودی، شارژ دستی و نظارت بر کیف پول کاربران",
          })}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-border bg-card rounded-2xl border p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t(
                "features.finance.wallets.filters.searchPlaceholder",
                {
                  defaultValue: "جستجو با شناسه کاربر (User UUID)...",
                },
              )}
            />
          </div>

          <div>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="مرتب‌سازی"
            >
              <option value="-created_at">
                {t("features.finance.wallets.filters.sortNewest", {
                  defaultValue: "جدیدترین ابتدا",
                })}
              </option>
              <option value="created_at">
                {t("features.finance.wallets.filters.sortOldest", {
                  defaultValue: "قدیمی‌ترین ابتدا",
                })}
              </option>
            </Select>
          </div>
        </div>
      </div>

      {/* Wallets Table */}
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

      {/* Charge Wallet Dialog */}
      <Dialog
        open={Boolean(selectedWallet)}
        onOpenChange={(open) => !open && setSelectedWallet(null)}
      >
        <DialogPopup>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <PlusCircle className="size-5" />
              </span>
              <DialogTitle>
                {t("features.finance.wallets.chargeModalTitle", {
                  defaultValue: "افزایش موجودی کیف پول",
                })}
              </DialogTitle>
            </div>
            <DialogDescription className="mt-1.5">
              {t("features.finance.wallets.chargeModalDesc", {
                defaultValue:
                  "شارژ مستقیم کیف پول کاربر به میکرودلار. این عملیات بلافاصله اعمال می‌شود.",
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedWallet && (
            <div className="space-y-4 py-2">
              <div className="border-border bg-muted/40 space-y-2 rounded-xl border p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">شناسه کیف پول:</span>
                  <span dir="ltr" className="font-mono font-medium">
                    {selectedWallet.uuid.slice(0, 12)}…
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">شناسه کاربر:</span>
                  <span dir="ltr" className="font-mono font-medium">
                    {selectedWallet.user_uuid.slice(0, 12)}…
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">موجودی فعلی:</span>
                  <UsdmicroAmount
                    value={selectedWallet.balance_usdmicro}
                    hint="inline"
                    amountClassName="text-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="charge-amount"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.finance.wallets.amountLabel", {
                    defaultValue: "مبلغ شارژ (میکرودلار):",
                  })}
                </label>
                <UsdmicroInput
                  id="charge-amount"
                  value={chargeAmountUsdmicro}
                  onValueChange={(v) => setChargeAmountUsdmicro(v)}
                  disabled={isCharging}
                />
                <UsdmicroInputHint value={chargeAmountUsdmicro} />
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="charge-reason"
                  className="text-foreground text-xs font-medium"
                >
                  {t("features.finance.wallets.reasonLabel", {
                    defaultValue: "علت یا شماره پیگیری (اختیاری):",
                  })}
                </label>
                <Input
                  id="charge-reason"
                  value={chargeReason}
                  onChange={(e) => setChargeReason(e.target.value)}
                  placeholder="مثال: جبران خطای سرویس / پاداش..."
                  disabled={isCharging}
                />
              </div>

              {/* Explicit Confirmation Checkbox */}
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <input
                  id="confirm-charge"
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="border-border mt-0.5 rounded"
                  disabled={isCharging}
                />
                <label
                  htmlFor="confirm-charge"
                  className="cursor-pointer text-xs leading-relaxed text-amber-900 select-none dark:text-amber-300"
                >
                  {t("features.finance.wallets.confirmCheckbox", {
                    defaultValue:
                      "صحت مبلغ و واریز به این کاربر را بررسی کرده‌ام و آن را تأیید می‌کنم.",
                  })}
                </label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              disabled={
                !isConfirmed ||
                isCharging ||
                !parseUsdmicro(chargeAmountUsdmicro)
              }
              onClick={handleChargeSubmit}
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isCharging && <Loader2 className="size-4 animate-spin" />}
              {t("features.finance.wallets.confirmChargeBtn", {
                defaultValue: "تأیید و افزایش اعتبار",
              })}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isCharging}
              onClick={() => setSelectedWallet(null)}
            >
              {t("common.cancel", { defaultValue: "انصراف" })}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
