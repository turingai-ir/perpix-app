import type { PropsWithChildren } from "react";
import { useAppTranslate } from "@/hooks";
import { Button } from "@/components/ui/button";

export function ReportPanel({
  title,
  pending,
  error,
  empty,
  retry,
  children,
}: PropsWithChildren<{
  title: string;
  pending: boolean;
  error: boolean;
  empty: boolean;
  retry: () => void;
}>) {
  const { t } = useAppTranslate();
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-6 font-semibold">{title}</h2>
      {pending ? (
        <p
          role="status"
          className="py-12 text-center text-sm text-muted-foreground"
        >
          {t("overview.loading")}
        </p>
      ) : error ? (
        <div role="alert" className="space-y-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">{t("overview.error")}</p>
          <Button variant="outline" onClick={retry}>
            {t("overview.retry")}
          </Button>
        </div>
      ) : empty ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t("overview.empty")}
        </p>
      ) : (
        children
      )}
    </section>
  );
}
