import { useMemo, useState } from "react";
import {
  DollarSign,
  RefreshCw,
  TrendingUp,
  ArrowRightLeft,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";
import { useExchangeRate } from "../hooks/use-exchange-rate";
import { useFinanceActions } from "../hooks/use-finance-actions";
import { useFinanceReports } from "../hooks/use-finance-reports";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useAppTranslate } from "@/hooks";
import type { components } from "@/services/api/api";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";
import {
  USDMICRO_PER_TOKEN,
  formatTokensFromUsdmicro,
  formatUsdmicro,
  parseUsdmicro,
} from "@/utils/usdmicro";
import { UsdmicroInput } from "@/components/custom/usdmicro-input";

type ReportBucket = components["schemas"]["AdminReportBucket"];

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

export function ExchangeRatePage() {
  const { t } = useAppTranslate();
  const {
    data: exchangeRate,
    isPending: isRateLoading,
    refetch: refetchRate,
  } = useExchangeRate();
  const { refreshExchangeRate, isRefreshingRate } = useFinanceActions();

  // Quick Calculator state
  const [calcUsdmicro, setCalcUsdmicro] = useState("1000000");

  // Report range filter: days
  const [daysRange, setDaysRange] = useState("30");
  const [reportTab, setReportTab] = useState<
    "payments" | "wallets" | "balances"
  >("payments");

  const dateFilter = useMemo(() => {
    if (daysRange === "all") return {};
    const days = parseInt(daysRange, 10);
    const d = new Date();
    d.setDate(d.getDate() - days);
    return { created_from: d.toISOString() };
  }, [daysRange]);

  const {
    paymentDaily,
    paymentStatuses,
    walletDaily,
    walletSources,
    walletDirections,
    walletBalances,
  } = useFinanceReports(dateFilter);

  const rateValue = exchangeRate?.value ? parseFloat(exchangeRate.value) : 0;
  const parsedCalcUsdmicro = parseUsdmicro(calcUsdmicro) ?? 0;
  const calculatedIrr = Math.round(
    (parsedCalcUsdmicro * rateValue) / 1_000_000,
  );
  const calculatedToman = Math.round(calculatedIrr / 10);

  const handleRefresh = async () => {
    try {
      await refreshExchangeRate();
      void refetchRate();
    } catch {
      // toast is already handled in hook
    }
  };

  const translateKey = (key: string) => {
    switch (key) {
      case "SUCCEEDED":
        return t("features.finance.payments.statusLabels.SUCCEEDED", {
          defaultValue: "موفق",
        });
      case "FAILED":
        return t("features.finance.payments.statusLabels.FAILED", {
          defaultValue: "ناموفق",
        });
      case "PENDING":
        return t("features.finance.payments.statusLabels.PENDING", {
          defaultValue: "در انتظار",
        });
      case "EXPIRED":
        return t("features.finance.payments.statusLabels.EXPIRED", {
          defaultValue: "منقضی شده",
        });
      case "CREDIT":
        return t("features.finance.transactions.directionLabels.CREDIT", {
          defaultValue: "افزایش اعتبار (واریز)",
        });
      case "DEBIT":
        return t("features.finance.transactions.directionLabels.DEBIT", {
          defaultValue: "کسر اعتبار (برداشت)",
        });
      case "ADMIN_CHARGE":
        return t("features.finance.transactions.sourceLabels.ADMIN_CHARGE", {
          defaultValue: "شارژ دستی مدیر",
        });
      case "PAYMENT":
        return t("features.finance.transactions.sourceLabels.PAYMENT", {
          defaultValue: "درگاه بانکی",
        });
      case "TASK_USAGE":
        return t("features.finance.transactions.sourceLabels.TASK_USAGE", {
          defaultValue: "مصرف هوش مصنوعی",
        });
      case "SUBSCRIPTION":
        return t("features.finance.transactions.sourceLabels.SUBSCRIPTION", {
          defaultValue: "خرید بسته اشتراکی",
        });
      case "REFUND":
        return t("features.finance.transactions.sourceLabels.REFUND", {
          defaultValue: "استرداد وجه",
        });
      default:
        return key;
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <TrendingUp className="text-primary size-6" />
            {t("features.finance.exchangeRate.title", {
              defaultValue: "نرخ ارز و گزارش‌های مالی",
            })}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("features.finance.exchangeRate.description", {
              defaultValue:
                "مشاهدهٔ آخرین نرخ برابری ارز، بروزرسانی دستی و شاخص‌های مالی سیستم",
            })}
          </p>
        </div>

        <Button
          variant="outline"
          disabled={isRefreshingRate || isRateLoading}
          onClick={handleRefresh}
          className="cursor-pointer gap-2 shadow-xs"
        >
          {isRefreshingRate ? (
            <Loader2 className="text-primary size-4 animate-spin" />
          ) : (
            <RefreshCw className="text-primary size-4" />
          )}
          {t("features.finance.exchangeRate.refreshButton", {
            defaultValue: "بروزرسانی نرخ ارز",
          })}
        </Button>
      </div>

      {/* Currency Rate Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* USD to IRR Card */}
        <Card className="border-border from-primary/5 via-card to-card bg-linear-to-bl shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                <DollarSign className="text-primary size-4" />
                {t("features.finance.exchangeRate.usdToIrr", {
                  defaultValue: "نرخ ۱ دلار آمریکا (USD)",
                })}
              </span>
              <Badge variant="success" className="gap-1 text-xs">
                <CheckCircle2 className="size-3" />
                {t("features.finance.exchangeRate.active", {
                  defaultValue: "فعال",
                })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isRateLoading ? (
              <div className="text-muted-foreground flex items-center gap-2 py-3 text-sm">
                <Loader2 className="size-4 animate-spin" />
                {t("common.table.loading", {
                  defaultValue: "در حال دریافت...",
                })}
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground font-mono text-2xl font-extrabold sm:text-3xl">
                    {rateValue ? faNumber(rateValue) : "—"}
                  </span>
                  <span className="text-muted-foreground text-sm font-semibold">
                    ریال
                  </span>
                </div>
                {rateValue > 0 && (
                  <p className="text-muted-foreground text-xs">
                    معادل{" "}
                    <span className="text-foreground font-mono font-semibold">
                      {faNumber(Math.round(rateValue / 10))}
                    </span>{" "}
                    تومان
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* USD to USDMICRO Card */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                <ArrowRightLeft className="text-primary size-4" />
                {t("features.finance.exchangeRate.unitRatio", {
                  defaultValue: "واحد محاسباتی میکرودلار",
                })}
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                USDMICRO
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground font-mono text-2xl font-extrabold sm:text-3xl">
                ۱,۰۰۰,۰۰۰
              </span>
              <span className="text-muted-foreground text-sm font-semibold">
                میکرودلار / USD
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              همهٔ مبالغ پنل به میکرودلار است. هر توکن (واحد اپ کاربر) ={" "}
              <span className="text-foreground font-mono font-semibold">
                {formatUsdmicro(USDMICRO_PER_TOKEN)}
              </span>{" "}
              میکرودلار
            </p>
          </CardContent>
        </Card>

        {/* Last Update Info Card */}
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Clock className="text-primary size-4" />
                {t("features.finance.exchangeRate.lastUpdate", {
                  defaultValue: "آخرین استعلام و بروزرسانی",
                })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-foreground text-lg font-bold">
              {exchangeRate?.date ? formatDate(exchangeRate.date) : "—"}
            </div>
            <p className="text-muted-foreground text-xs">
              مبدا:{" "}
              <span className="font-mono font-semibold">
                {exchangeRate?.from_currency || "USD"}
              </span>{" "}
              / مقصد:{" "}
              <span className="font-mono font-semibold">
                {exchangeRate?.to_currency || "IRR"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Calculator Widget */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ArrowRightLeft className="text-primary size-4" />
            {t("features.finance.exchangeRate.calculatorTitle", {
              defaultValue: "تبدیل و محاسبه‌گر سریع ارز",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <label
                htmlFor="usd-calc-input"
                className="text-muted-foreground text-xs font-medium"
              >
                {t("features.finance.exchangeRate.amountUsdmicro", {
                  defaultValue: "مبلغ (میکرودلار):",
                })}
              </label>
              <UsdmicroInput
                id="usd-calc-input"
                value={calcUsdmicro}
                onValueChange={(v) => setCalcUsdmicro(v)}
              />
            </div>

            <div className="bg-muted/40 border-border rounded-xl border p-3">
              <div className="text-muted-foreground mb-1 text-xs">
                معادل به ریال:
              </div>
              <div className="text-foreground truncate font-mono text-base font-bold">
                {rateValue > 0 ? `${faNumber(calculatedIrr)} ریال` : "—"}
              </div>
            </div>

            <div className="bg-muted/40 border-border rounded-xl border p-3">
              <div className="text-muted-foreground mb-1 text-xs">
                معادل به تومان:
              </div>
              <div className="text-foreground truncate font-mono text-base font-bold">
                {rateValue > 0 ? `${faNumber(calculatedToman)} تومان` : "—"}
              </div>
            </div>

            <div className="bg-muted/40 border-border rounded-xl border p-3">
              <div className="text-muted-foreground mb-1 text-xs">
                معادل توکن (اپ کاربر):
              </div>
              <div className="text-foreground truncate font-mono text-base font-bold">
                {formatTokensFromUsdmicro(parsedCalcUsdmicro)} توکن
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Section */}
      <div className="space-y-4 pt-4">
        <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Layers className="text-primary size-5" />
              {t("features.finance.reports.title", {
                defaultValue: "گزارش‌های آماری مالی",
              })}
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {t("features.finance.reports.description", {
                defaultValue:
                  "بررسی حجم و آمار تفکیکی پرداخت‌ها، تراکنش‌ها و موجودی سیستم",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground size-4" />
            <Select
              value={daysRange}
              onChange={(e) => setDaysRange(e.target.value)}
              className="w-40 text-xs"
            >
              <option value="1">۲۴ ساعت اخیر</option>
              <option value="7">۷ روز گذشته</option>
              <option value="30">۳۰ روز گذشته</option>
              <option value="90">۹۰ روز گذشته</option>
              <option value="all">تمام سوابق</option>
            </Select>
          </div>
        </div>

        {/* Report Tab Selector */}
        <div className="border-border flex items-center gap-2 overflow-x-auto border-b pb-2">
          <Button
            variant={reportTab === "payments" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportTab("payments")}
            className="cursor-pointer gap-2"
          >
            <CreditCard className="size-4" />
            {t("features.finance.reports.tabs.payments", {
              defaultValue: "گزارش پرداخت‌ها",
            })}
          </Button>
          <Button
            variant={reportTab === "wallets" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportTab("wallets")}
            className="cursor-pointer gap-2"
          >
            <Wallet className="size-4" />
            {t("features.finance.reports.tabs.wallets", {
              defaultValue: "تراکنش‌های کیف پول",
            })}
          </Button>
          <Button
            variant={reportTab === "balances" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportTab("balances")}
            className="cursor-pointer gap-2"
          >
            <DollarSign className="size-4" />
            {t("features.finance.reports.tabs.balances", {
              defaultValue: "موجودی‌ها",
            })}
          </Button>
        </div>

        {/* Tab 1: Payments */}
        {reportTab === "payments" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Statuses Breakdown */}
              <ReportBucketTable
                title={t("features.finance.reports.paymentStatusesTitle", {
                  defaultValue: "تفکیک پرداخت‌ها بر اساس وضعیت",
                })}
                keyHeader="وضعیت پرداخت"
                buckets={paymentStatuses.data?.items}
                isLoading={paymentStatuses.isPending}
                translateKey={translateKey}
              />

              {/* Daily Breakdown */}
              <ReportBucketTable
                title={t("features.finance.reports.paymentDailyTitle", {
                  defaultValue: "روند روزانه پرداخت‌ها",
                })}
                keyHeader="تاریخ"
                buckets={paymentDaily.data?.items}
                isLoading={paymentDaily.isPending}
                formatKeyAsDate
              />
            </div>
          </div>
        )}

        {/* Tab 2: Wallets */}
        {reportTab === "wallets" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Sources Breakdown */}
              <ReportBucketTable
                title={t("features.finance.reports.walletSourcesTitle", {
                  defaultValue: "تفکیک تراکنش‌ها بر اساس منبع (Source)",
                })}
                keyHeader="منبع تراکنش"
                buckets={walletSources.data?.items}
                isLoading={walletSources.isPending}
                translateKey={translateKey}
              />

              {/* Directions Breakdown */}
              <ReportBucketTable
                title={t("features.finance.reports.walletDirectionsTitle", {
                  defaultValue: "تفکیک بر اساس جهت (واریز / برداشت)",
                })}
                keyHeader="جهت تراکنش"
                buckets={walletDirections.data?.items}
                isLoading={walletDirections.isPending}
                translateKey={translateKey}
              />
            </div>

            {/* Daily Wallet Activity */}
            <ReportBucketTable
              title={t("features.finance.reports.walletDailyTitle", {
                defaultValue: "روند روزانه فعالیت کیف پول‌ها",
              })}
              keyHeader="تاریخ"
              buckets={walletDaily.data?.items}
              isLoading={walletDaily.isPending}
              formatKeyAsDate
            />
          </div>
        )}

        {/* Tab 3: Balances */}
        {reportTab === "balances" && (
          <div className="space-y-6">
            <ReportBucketTable
              title={t("features.finance.reports.balancesTitle", {
                defaultValue: "گزارش تجمیعی موجودی‌های سیستم",
              })}
              keyHeader="شاخص موجودی"
              buckets={walletBalances.data?.items}
              isLoading={walletBalances.isPending}
              translateKey={translateKey}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function ReportBucketTable({
  title,
  keyHeader,
  buckets,
  isLoading,
  translateKey,
  formatKeyAsDate = false,
}: {
  title: string;
  keyHeader: string;
  buckets?: unknown;
  isLoading: boolean;
  translateKey?: (k: string) => string;
  formatKeyAsDate?: boolean;
}) {
  const items: ReportBucket[] = buckets
    ? Array.from(buckets as ArrayLike<ReportBucket>)
    : [];

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="border-border flex flex-row items-center justify-between border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <span className="text-muted-foreground font-mono text-xs">
          {items.length ? `${faNumber(items.length)} مورد` : ""}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 p-8 text-sm">
            <Loader2 className="text-primary size-4 animate-spin" />
            در حال دریافت آمار...
          </div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground p-8 text-center text-xs">
            داده‌ای در این بازه زمانی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right text-xs">
                    {keyHeader}
                  </TableHead>
                  <TableHead className="text-center text-xs">تعداد</TableHead>
                  <TableHead className="text-left font-mono text-xs">
                    مبلغ (میکرودلار)
                  </TableHead>
                  <TableHead className="text-left font-mono text-xs">
                    مبلغ ریالی
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((b, idx) => {
                  const displayKey = formatKeyAsDate
                    ? formatDate(b.key)
                    : translateKey
                      ? translateKey(b.key)
                      : b.key;

                  return (
                    <TableRow key={`${b.key}-${idx}`}>
                      <TableCell className="text-xs font-medium">
                        {displayKey}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {faNumber(b.count)}
                      </TableCell>
                      <TableCell className="text-left text-xs">
                        <UsdmicroAmount
                          value={b.amount_usdmicro || 0}
                          amountClassName="text-primary font-semibold"
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-left font-mono text-xs">
                        {b.amount_irr ? `${faNumber(b.amount_irr)} ریال` : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
