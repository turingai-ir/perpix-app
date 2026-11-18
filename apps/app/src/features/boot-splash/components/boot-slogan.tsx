import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import styles from "./boot-slogan.module.css";

export function BootSlogan() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className={styles.sign} data-office-sign dir="rtl">
      <p>
        <span className={styles.brand}>
          {t("pages.app.layout.slogan.brand")}
        </span>{" "}
        <span className={styles.promise}>
          {t("pages.app.layout.slogan.promise")}
        </span>
      </p>
    </div>
  );
}
