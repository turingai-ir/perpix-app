import { useParams, Link } from "react-router";
import { Cpu, User, Calendar, Coins, Wallet, RefreshCw } from "lucide-react";
import { useAiGatewayRequestDetail } from "../../hooks/use-ai-gateway-request-detail";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";
import { GenerationStatusBadge } from "./generation-status-badge";
import { GenerationManualActions } from "./generation-manual-actions";

const REVIEW_REASON_LABELS = {
  COST_UNRESOLVED: "هزینهٔ واقعی مشخص نیست",
  RESULT_UNREADABLE: "نتیجهٔ ارائه‌دهنده قابل خواندن نیست",
} as const;

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString("fa-IR") : "-";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="text-muted-foreground block text-xs">{label}</span>
      <div className="text-xs">{children}</div>
    </div>
  );
}

export function AiGatewayRequestDetailPage() {
  const { t } = useAppTranslate();
  const { requestUuid = "" } = useParams<{ requestUuid: string }>();

  const { generation, isLoading, error, refetch } =
    useAiGatewayRequestDetail(requestUuid);

  return (
    <DetailPageLayout
      breadcrumbs={[
        {
          label: t("features.ai.gateway.menuTitle", {
            defaultValue: "درخواست‌های Gateway",
          }),
          href: "/ai/gateway-requests",
        },
        {
          label: generation?.uuid || requestUuid.slice(0, 8),
        },
      ]}
      title={t("features.ai.gateway.detailTitle", {
        defaultValue: "جزئیات درخواست AI Gateway",
      })}
      subtitle={generation?.uuid}
      isLoading={isLoading}
      isError={Boolean(error)}
      errorMessage={error instanceof Error ? error.message : undefined}
      onRetry={() => void refetch()}
      actions={
        <Button
          variant="outline"
          onClick={() => void refetch()}
          className="gap-1.5"
        >
          <RefreshCw className="size-4" />
          {t("common.refresh", { defaultValue: "بارگذاری مجدد" })}
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Cpu className="text-primary size-4" />
                {t("features.ai.gateway.overview", {
                  defaultValue: "اطلاعات کلی درخواست",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t("features.ai.gateway.user", {
                    defaultValue: "کاربر",
                  })}
                >
                  {generation?.user_uuid ? (
                    <Link
                      to={`/users/${generation.user_uuid}`}
                      className="text-primary inline-flex items-center gap-1.5 font-mono font-semibold hover:underline"
                    >
                      <User className="size-3.5" />
                      {generation.user_uuid}
                    </Link>
                  ) : (
                    "-"
                  )}
                </Field>

                <Field
                  label={t("features.ai.gateway.status", {
                    defaultValue: "وضعیت درخواست",
                  })}
                >
                  {generation ? (
                    <GenerationStatusBadge status={generation.status} />
                  ) : (
                    "-"
                  )}
                </Field>

                <Field label="مدل">
                  {generation?.model_name || generation?.model_uuid || "-"}
                </Field>

                <Field label="ارائه‌دهنده">
                  {generation?.provider_name ||
                    generation?.provider_uuid ||
                    "-"}
                </Field>

                <Field
                  label={t("features.ai.gateway.retries", {
                    defaultValue: "تعداد تلاش‌ها",
                  })}
                >
                  <span className="font-mono">{generation?.attempts ?? 0}</span>
                </Field>

                <Field label="خواندن ناموفق نتیجه (پشت‌سرهم)">
                  <span className="font-mono">
                    {generation?.unreadable_polls ?? 0}
                  </span>
                </Field>

                <Field label="شناسهٔ وظیفهٔ ارائه‌دهنده">
                  {generation?.has_external_task ? "ثبت شده" : "ثبت نشده"}
                </Field>

                <Field label="اجرای بعدی">
                  <span dir="ltr">{formatDate(generation?.next_run_at)}</span>
                </Field>

                <Field label="علت بررسی">
                  {generation?.review_reason ? (
                    <Badge
                      variant="outline"
                      className="border-amber-500 text-amber-600"
                    >
                      {REVIEW_REASON_LABELS[generation.review_reason]}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </Field>

                <Field
                  label={t("features.ai.gateway.createdAt", {
                    defaultValue: "زمان ایجاد",
                  })}
                >
                  <span className="inline-flex items-center gap-1.5" dir="ltr">
                    <Calendar className="size-3.5" />
                    {formatDate(generation?.created_at)}
                  </span>
                </Field>
              </div>

              {generation?.last_error && (
                <pre
                  className="mt-4 max-h-48 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs whitespace-pre-wrap text-red-300 dark:bg-zinc-900"
                  dir="ltr"
                >
                  {generation.last_error}
                </pre>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {generation?.status === "NEEDS_REVIEW" && (
              <GenerationManualActions
                generationUuid={generation.uuid}
                reviewReason={generation.review_reason}
                onDone={() => void refetch()}
              />
            )}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Coins className="size-4 text-emerald-600" />
                  {t("features.ai.gateway.costs", { defaultValue: "هزینه" })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg border p-3">
                  <span className="text-muted-foreground block text-xs">
                    هزینه واقعی (Actual Cost):
                  </span>
                  <UsdmicroAmount
                    value={generation?.actual_cost_usdmicro}
                    amountClassName="text-lg font-bold text-emerald-600"
                  />
                </div>
                <div className="bg-muted/30 rounded-lg border p-3">
                  <span className="text-muted-foreground block text-xs">
                    هزینه تخمینی (Estimated Cost):
                  </span>
                  <UsdmicroAmount
                    value={generation?.estimated_cost_usdmicro}
                    amountClassName="text-sm font-semibold"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Wallet className="size-4" />
                  رزرو کیف پول
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="وضعیت رزرو">
                  {generation?.reservation_status || "-"}
                </Field>
                <Field label="مبلغ رزروشده">
                  <UsdmicroAmount value={generation?.reserved_usdmicro} />
                </Field>
                <Field label="علت آزادسازی">
                  {generation?.release_reason || "-"}
                </Field>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DetailPageLayout>
  );
}
