import * as React from "react";
import { Link } from "react-router";
import { ArrowRight, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DetailPageLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function DetailPageLayout({
  breadcrumbs,
  backHref,
  backLabel,
  title,
  subtitle,
  badges,
  actions,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  children,
  className,
}: DetailPageLayoutProps) {
  const { t } = useAppTranslate();

  return (
    <div
      className={cn(
        "mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      {/* Breadcrumbs & Back */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav
          aria-label="مسیر صفحه"
          className="text-muted-foreground flex items-center gap-1.5 text-xs"
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className="text-muted-foreground/50">/</span>}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="hover:text-foreground font-medium transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-semibold">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {backHref && (
          <Link
            to={backHref}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1 text-xs",
            )}
          >
            <ArrowRight className="size-3.5" />
            {backLabel || t("common.back", { defaultValue: "بازگشت" })}
          </Link>
        )}
      </div>

      {/* Header with Title, Badges and Actions */}
      <div className="border-border bg-card flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {badges && (
              <div className="flex flex-wrap items-center gap-2">{badges}</div>
            )}
          </div>
          {subtitle && (
            <div className="text-muted-foreground font-mono text-xs">
              {subtitle}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Main Content / Loading / Error */}
      {isLoading ? (
        <div className="border-border bg-card flex h-80 items-center justify-center rounded-2xl border p-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">
              {t("common.loading", {
                defaultValue: "در حال دریافت اطلاعات...",
              })}
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="border-border bg-card flex h-80 items-center justify-center rounded-2xl border p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
              <AlertCircle className="size-6" />
            </span>
            <p className="text-foreground font-medium">
              {errorMessage ||
                t("common.error", { defaultValue: "خطا در بارگذاری اطلاعات" })}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="gap-1.5"
              >
                <RefreshCw className="size-3.5" />
                {t("common.retry", { defaultValue: "تلاش دوباره" })}
              </Button>
            )}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
