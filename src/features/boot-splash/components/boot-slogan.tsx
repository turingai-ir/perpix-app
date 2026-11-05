import { cn } from "@/lib/utils";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "./boot-slogan.module.css";

/** Extruded, shimmering PerPix slogan shown while the 3D fight loads. */
export function BootSlogan() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="boot-static" aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.block}>
          <p className={styles.line}>{t("features.bootSplash.sloganLead")}</p>
          <p className={cn(styles.line, styles.accent)}>
            {t("features.bootSplash.sloganAccent")}
          </p>
        </div>
        <span className={styles.charge} />
      </div>
    </div>
  );
}
