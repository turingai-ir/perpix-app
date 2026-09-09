import type { FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../design-preview.module.css";

const PreviewLogoStage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div
      id="models"
      className={`${styles.logoStage} mx-auto aspect-square w-full max-w-lg`}
    >
      <div className={styles.logoHalo} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true" />
      <img
        src="/android-chrome-512x512.png"
        alt={t("pages.designPreview.logoAlt")}
        className={styles.heroLogo}
      />
      <span className={`${styles.modelChip} ${styles.modelChipOne}`}>
        <i aria-hidden="true" className="size-2 rounded-full bg-fuchsia-400" />
        {t("pages.designPreview.hero.modelOne")}
      </span>
      <span className={`${styles.modelChip} ${styles.modelChipTwo}`}>
        <i aria-hidden="true" className="size-2 rounded-full bg-sky-400" />
        {t("pages.designPreview.hero.modelTwo")}
      </span>
      <span className={`${styles.modelChip} ${styles.modelChipThree}`}>
        <i aria-hidden="true" className="size-2 rounded-full bg-violet-400" />
        {t("pages.designPreview.hero.modelThree")}
      </span>
    </div>
  );
};

export default PreviewLogoStage;
