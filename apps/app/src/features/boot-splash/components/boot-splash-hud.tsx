import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import styles from "./boot-office.module.css";

export function BootSplashHud({
  onSkip,
  skipped,
}: {
  onSkip: () => void;
  skipped: boolean;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className={styles.hud} dir="rtl">
      <div className={styles.masthead}>
        <span className={styles.wordmark} dir="ltr" aria-hidden="true">
          {t("features.bootSplash.brand")}
        </span>
        <button
          type="button"
          className={styles.skip}
          onClick={onSkip}
          disabled={skipped}
        >
          {t("features.bootSplash.skip")}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className={styles.caption}>
        <p>{t("features.bootSplash.sloganLead")}</p>
        <p>{t("features.bootSplash.sloganAccent")}</p>
        <div
          role="status"
          aria-label={t("features.bootSplash.loading")}
          className={styles.status}
        >
          <span className={styles.indicator} aria-hidden="true" />
          {t("features.bootSplash.loading")}
        </div>
      </div>
    </div>
  );
}
