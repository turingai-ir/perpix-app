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
      <div className={styles.headerCopy}>
        <p className={styles.eyebrow}>
          <Sparkles className="size-4" aria-hidden="true" />
          {t("pages.gallery.studio.eyebrow")}
        </p>
        <h1 className={styles.title}>{t("pages.gallery.studio.title")}</h1>
        <p className={styles.description}>
          {t("pages.gallery.studio.description")}
        </p>
        <div className={styles.headerActions}>
          <Button asChild className={styles.createButton}>
            <Link to="/">
              <span>{t("pages.gallery.studio.create")}</span>
              <ArrowUpLeft aria-hidden="true" className="ltr:rotate-90" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className={styles.refreshButton}
            disabled={refreshing}
            onClick={onRefresh}
          >
            <RefreshCw
              aria-hidden="true"
              className={refreshing ? "motion-safe:animate-spin" : ""}
            />
            <span>{t("pages.gallery.actions.refresh")}</span>
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
