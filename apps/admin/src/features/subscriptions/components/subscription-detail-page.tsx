import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  Sparkles,
  User,
  Calendar,
  Clock,
  Check,
  Copy,
  Ban,
  RotateCcw,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useSubscriptionDetail } from "../hooks/use-subscription-detail";
import { useSubscriptionActions } from "../hooks/use-subscription-actions";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";

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

export function SubscriptionDetailPage() {
  const { t } = useAppTranslate();
  const { subscriptionUuid = "" } = useParams<{ subscriptionUuid: string }>();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const {
    data: subscription,
    isPending,
    isError,
    error,
    refetch,
  } = useSubscriptionDetail(subscriptionUuid);
  const { deactivateSubscription, isDeactivating } = useSubscriptionActions();

  const handleCopy = (field: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDeactivate = async () => {
    if (!subscription) return;
    try {
      await deactivateSubscription({
        user_uuid: subscription.user_uuid,
      });
      setIsDeactivateOpen(false);
      void refetch();
    } catch {
      // toast handled in hook
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            {t("features.subscriptions.statusLabels.active", {
              defaultValue: "فعال",
            })}
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="muted" className="gap-1">
            <Clock className="size-3" />
            {t("features.subscriptions.statusLabels.expired", {
              defaultValue: "منقضی شده",
            })}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="warning" className="gap-1">
            <Calendar className="size-3" />
            {t("features.subscriptions.statusLabels.scheduled", {
              defaultValue: "زمان‌بندی‌شده",
            })}
          </Badge>
        );
      case "replaced":
        return (
          <Badge variant="outline" className="gap-1">
            <RotateCcw className="size-3" />
            {t("features.subscriptions.statusLabels.replaced", {
              defaultValue: "جایگزین‌شده",
            })}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t(`features.subscriptions.statusLabels.${status}`, {
              defaultValue: status,
            })}
          </Badge>
        );
    }
  };

  const [currentTime] = useState(() => Date.now());
  const isExpired = subscription?.expires_at
    ? new Date(subscription.expires_at).getTime() < currentTime
    : false;

  return (
    <>
      <DetailPageLayout
        breadcrumbs={[
          {
            label: t("features.subscriptions.menuTitle", {
              defaultValue: "اشتراک‌ها",
            }),
            href: "/subscriptions",
          },
          {
            label: subscription?.uuid || subscriptionUuid.slice(0, 8),
          },
        ]}
        title={t("features.subscriptions.detailTitle", {
          defaultValue: "جزئیات اشتراک",
        })}
        subtitle={
          subscription?.plan_name
            ? `${subscription.plan_name}`
            : subscriptionUuid
        }
        isLoading={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch();
        }}
        actions={
          subscription?.status === "active" ? (
            <Button
              variant="destructive"
              onClick={() => setIsDeactivateOpen(true)}
              className="cursor-pointer gap-2 shadow-xs"
            >
              <Ban className="size-4" />
              {t("features.subscriptions.actions.deactivate", {
                defaultValue: "غیرفعال‌سازی اشتراک",
              })}
            </Button>
          ) : undefined
        }
      >
        {subscription && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Status & Timing Card */}
            <Card className="border-border shadow-xs">
              <CardHeader className="border-border border-b pb-3">
                <CardTitle className="flex items-center justify-between text-base font-semibold">
                  <span className="flex items-center gap-2">
                    <Clock className="text-primary size-4" />
                    {t("features.subscriptions.cards.timingTitle", {
                      defaultValue: "وضعیت و زمان‌بندی",
                    })}
                  </span>
                  {renderStatusBadge(subscription.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    {t("features.subscriptions.fields.uuid", {
                      defaultValue: "شناسه اشتراک (UUID)",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted text-foreground rounded px-2 py-1 font-mono text-xs break-all">
                      {subscription.uuid}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy("uuid", subscription.uuid)}
                      aria-label="کپی شناسه"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer rounded p-1 transition-colors"
                    >
                      {copiedField === "uuid" ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-border grid grid-cols-2 gap-4 border-t pt-2">
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Calendar className="size-3" />
                      {t("features.subscriptions.fields.startedAt", {
                        defaultValue: "تاریخ شروع",
                      })}
                    </span>
                    <p className="text-foreground text-sm font-medium">
                      {formatDate(subscription.started_at)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="size-3" />
                      {t("features.subscriptions.fields.expiresAt", {
                        defaultValue: "تاریخ انقضا",
                      })}
                    </span>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isExpired ? "text-destructive" : "text-foreground",
                      )}
                    >
                      {formatDate(subscription.expires_at)}
                    </p>
                  </div>
                </div>

                <div className="border-border space-y-1 border-t pt-2">
                  <span className="text-muted-foreground text-xs">
                    {t("features.subscriptions.fields.createdAt", {
                      defaultValue: "تاریخ ثبت در سیستم",
                    })}
                  </span>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(subscription.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User & Plan Info Card */}
            <Card className="border-border shadow-xs">
              <CardHeader className="border-border border-b pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Package className="text-primary size-4" />
                  {t("features.subscriptions.cards.userPlanTitle", {
                    defaultValue: "مشخصات کاربر و پلن",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <User className="size-3" />
                    {t("features.subscriptions.fields.user", {
                      defaultValue: "کاربر مشترک",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/users/${subscription.user_uuid}`}
                      className="text-primary font-mono text-sm hover:underline"
                    >
                      {subscription.user_uuid}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("user_uuid", subscription.user_uuid)
                      }
                      aria-label="کپی شناسه کاربر"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer rounded p-1 transition-colors"
                    >
                      {copiedField === "user_uuid" ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-border space-y-1 border-t pt-2">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Sparkles className="size-3" />
                    {t("features.subscriptions.fields.plan", {
                      defaultValue: "پلن اشتراکی",
                    })}
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground text-sm font-bold">
                        {subscription.plan_name || "بدون عنوان"}
                      </p>
                      <code className="text-muted-foreground font-mono text-xs">
                        {subscription.plan_uuid}
                      </code>
                    </div>
                    <Link
                      to="/subscription-plans"
                      className="text-primary text-xs hover:underline"
                    >
                      مشاهده پلن‌ها
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DetailPageLayout>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        title={t("features.subscriptions.dialogs.deactivateTitle", {
          defaultValue: "غیرفعال‌سازی اشتراک کاربر",
        })}
        description={t("features.subscriptions.dialogs.deactivateDescription", {
          defaultValue:
            "با غیرفعال‌سازی، دسترسی کاربر به امکانات و مدل‌های این پلن قطع خواهد شد. آیا از این عملیات اطمینان دارید؟",
        })}
        confirmText={t("features.subscriptions.dialogs.deactivateConfirm", {
          defaultValue: "غیرفعال‌سازی اشتراک",
        })}
        variant="destructive"
        isLoading={isDeactivating}
        onConfirm={handleDeactivate}
      />
    </>
  );
}
