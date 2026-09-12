import { ArrowUpLeft, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { DashboardBrandEntrance } from "../../_components/dashboard-brand-entrance";
import styles from "../gallery.module.css";

export function GalleryHeader({
  refreshing,
  onRefresh,
}: {
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <header className={styles.header}>
      <div className="relative z-10 max-w-2xl">
        <p className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-medium">
          <Sparkles className="size-4" aria-hidden="true" />
          {t("pages.gallery.studio.eyebrow")}
        </p>
        <h1 className="text-3xl leading-relaxed font-semibold tracking-tight md:text-4xl">
          {t("pages.gallery.studio.title")}
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-8">
          {t("pages.gallery.studio.description")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="h-11 rounded-full px-5">
            <Link to="/">
              <span>{t("pages.gallery.studio.create")}</span>
              <ArrowUpLeft aria-hidden="true" className="ltr:rotate-90" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="bg-background/80 h-11 rounded-full px-4"
            disabled={refreshing}
            onClick={onRefresh}
          >
            <RefreshCw
              aria-hidden="true"
              className={refreshing ? "motion-safe:animate-spin" : ""}
            />
            {t("pages.gallery.actions.refresh")}
          </Button>
        </div>
      </div>
      <div className={styles.brandSlot}>
        <DashboardBrandEntrance />
      </div>
      <div className={styles.orbit} aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
    </header>
  );
}
