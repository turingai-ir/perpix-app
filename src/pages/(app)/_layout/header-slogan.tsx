import { useEffect, useState } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import styles from "./header-slogan.module.css";

const HeaderSlogan = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [isPageVisible, setIsPageVisible] = useState(
    () => document.visibilityState === "visible",
  );
  const brand = t("pages.app.layout.slogan.brand");
  const promise = t("pages.app.layout.slogan.promise");

  useEffect(() => {
    // Pause decorative flashes in background tabs so they resume only when visible.
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div
      aria-label={`${brand} ${promise}`}
      className={styles.slogan}
      data-header-slogan
      data-motion={isPageVisible ? "running" : "paused"}
      dir="rtl"
    >
      <span aria-hidden="true" className={styles.pixel} />
      <span className={`${styles.word} ${styles.brand}`} data-text={brand}>
        {brand}
      </span>
      <span className={`${styles.word} ${styles.promise}`} data-text={promise}>
        {promise}
      </span>
      <span aria-hidden="true" className={styles.pixel} />
    </div>
  );
};

export default HeaderSlogan;
