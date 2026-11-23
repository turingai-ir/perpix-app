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
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className="text-muted-foreground/50">/</span>}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="font-medium transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">
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
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
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
            <div className="font-mono text-xs text-muted-foreground">
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
        <div className="flex h-80 items-center justify-center rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("common.loading", {
                defaultValue: "در حال دریافت اطلاعات...",
              })}
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex h-80 items-center justify-center rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </span>
            <p className="font-medium text-foreground">
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
