import type { FC } from "react";

import styles from "./loading-generation.module.css";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
export const LoadingGeneration: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className={styles.center}>
      <div className={styles.ring} />
      <span className={styles.text}>{t("common.coolTexts.cooking")}</span>
    </div>
  );
};
