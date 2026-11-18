import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  CreditCard,
  User,
  Calendar,
  Clock,
  KeyRound,
  Check,
  Copy,
  Receipt,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { usePaymentDetail } from "../hooks/use-payment-detail";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppTranslate } from "@/hooks";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";

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

export function PaymentDetailPage() {
  const { t } = useAppTranslate();
  const { paymentUuid = "" } = useParams<{ paymentUuid: string }>();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    data: payment,
    isPending,
    isError,
    error,
    refetch,
  } = usePaymentDetail(paymentUuid);

  const handleCopy = (field: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            {t("features.finance.payments.statusLabels.SUCCEEDED", {
              defaultValue: "پرداخت موفق",
            })}
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" />
            {t("features.finance.payments.statusLabels.FAILED", {
              defaultValue: "پرداخت ناموفق",
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
                status === "PENDING" ? "در انتظار نتیجه" : "در حال پردازش",
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
      default:
        return (
          <Badge variant="muted">
            {t(`features.finance.payments.statusLabels.${status}`, {
              defaultValue: status,
            })}
          </Badge>
        );
    }
  };

  return (
    <DetailPageLayout
      breadcrumbs={[
        {
          label: t("features.finance.menuTitle", { defaultValue: "مالی" }),
        },
        {
          label: t("features.finance.payments.title", {
            defaultValue: "پرداخت‌ها",
          }),
          href: "/finance/payments",
        },
        {
          label: paymentUuid.slice(0, 8),
        },
      ]}
      backHref="/finance/payments"
      backLabel={t("features.finance.payments.backToList", {
        defaultValue: "بازگشت به لیست پرداخت‌ها",
      })}
      title={
        <div className="flex items-center gap-2">
          <CreditCard className="text-primary size-6" />
          <span>
            {t("features.finance.payments.detailTitle", {
              defaultValue: "جزئیات تراکنش پرداخت",
            })}
          </span>
        </div>
      }
      subtitle={payment?.uuid}
      isLoading={isPending}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : undefined}
      onRetry={() => {
        void refetch();
      }}
      badges={
        payment && (
          <div className="flex flex-wrap items-center gap-2">
            {renderStatusBadge(payment.financial_status)}
            <Badge variant="secondary">
              {t(
                `features.finance.payments.targetLabels.${payment.target_type}`,
                {
                  defaultValue:
                    payment.target_type === "wallet_topup"
                      ? "شارژ کیف پول"
                      : payment.target_type === "subscription"
                        ? "اشتراک"
                        : payment.target_type,
                },
              )}
            </Badge>
            <Badge variant="outline">
              {t(
                `features.finance.payments.fulfillmentLabels.${payment.fulfillment_status}`,
                {
                  defaultValue: payment.fulfillment_status,
                },
              )}
            </Badge>
          </div>
        )
      }
    >
      {payment && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-border/60 border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Receipt className="text-primary size-4" />
                {t("features.finance.payments.infoCardTitle", {
                  defaultValue: "اطلاعات مالی و بانکی",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total IRR */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    {t("features.finance.payments.totalIrr", {
                      defaultValue: "مبلغ نهایی (ریال)",
                    })}
                  </span>
                  <p className="text-foreground text-lg font-bold tabular-nums">
                    {faNumber(payment.total_irr)}{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      {t("common.rial", { defaultValue: "ریال" })}
                    </span>
                  </p>
                </div>

                {/* Total USDmicro */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <DollarSign className="size-3" />
                    {t("features.finance.payments.totalUsdmicro", {
                      defaultValue: "معادل (میکرودلار)",
                    })}
                  </span>
                  <p>
                    <UsdmicroAmount
                      value={payment.total_usdmicro}
                      amountClassName="text-foreground text-lg font-bold"
                    />
                  </p>
                </div>

                {/* User Link */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <User className="size-3" />
                    {t("features.finance.payments.user", {
                      defaultValue: "کاربر پرداخت‌کننده",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/users/${payment.user_uuid}`}
                      className="text-primary font-mono text-sm hover:underline"
                    >
                      {payment.user_uuid.slice(0, 8)}…
                      {payment.user_uuid.slice(-4)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCopy("user_uuid", payment.user_uuid)}
                      aria-label="کپی شناسه کاربر"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
                    >
                      {copiedField === "user_uuid" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Target Type */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Tag className="size-3" />
                    {t("features.finance.payments.targetType", {
                      defaultValue: "هدف پرداخت",
                    })}
                  </span>
                  <p className="text-foreground text-sm font-medium">
                    {t(
                      `features.finance.payments.targetLabels.${payment.target_type}`,
                      {
                        defaultValue: payment.target_type,
                      },
                    )}
                  </p>
                </div>

                {/* Target ID */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs">
                    {t("features.finance.payments.targetId", {
                      defaultValue: "شناسه هدف (Target ID)",
                    })}
                  </span>
                  <p
                    dir="ltr"
                    className="text-muted-foreground truncate text-right font-mono text-xs"
                  >
                    {payment.target_id}
                  </p>
                </div>

                {/* Payment UUID */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <KeyRound className="size-3" />
                    {t("features.finance.payments.paymentUuid", {
                      defaultValue: "شناسه پرداخت (UUID)",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <p
                      dir="ltr"
                      className="text-muted-foreground max-w-[200px] truncate font-mono text-xs"
                    >
                      {payment.uuid}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy("uuid", payment.uuid)}
                      aria-label="کپی شناسه پرداخت"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
                    >
                      {copiedField === "uuid" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Created At */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="size-3" />
                    {t("features.finance.payments.createdAt", {
                      defaultValue: "تاریخ ایجاد تراکنش",
                    })}
                  </span>
                  <p className="text-foreground text-sm">
                    {formatDate(payment.created_at)}
                  </p>
                </div>

                {/* Expires At */}
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="size-3" />
                    {t("features.finance.payments.expiresAt", {
                      defaultValue: "مهلت انقضای تراکنش",
                    })}
                  </span>
                  <p className="text-foreground text-sm">
                    {formatDate(payment.expires_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DetailPageLayout>
  );
}
