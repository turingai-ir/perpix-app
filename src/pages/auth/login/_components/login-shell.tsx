import type { PropsWithChildren } from "react";
import { Aperture, Film, Sparkles } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../login.module.css";
import LoginArtwork from "./login-artwork";

export default function LoginShell({ children }: PropsWithChildren) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img
            src="/android-chrome-192x192.png"
            width="40"
            height="40"
            alt=""
          />
          <span>{t("pages.auth.login.visual.brand")}</span>
        </div>
        <span className={styles.headerNote}>
          {t("pages.auth.login.visual.studio")}
        </span>
      </header>
      <div className={styles.layout}>
        <section className={styles.hero} aria-labelledby="login-hero-title">
          <LoginArtwork />
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Sparkles size={14} aria-hidden="true" />
              {t("pages.auth.login.visual.eyebrow")}
            </span>
            <h1 id="login-hero-title">
              {t("pages.auth.login.visual.title")}
              <br />
              <span>{t("pages.auth.login.visual.titleAccent")}</span>
            </h1>
            <p>{t("pages.auth.login.visual.description")}</p>
            <div className={styles.capabilities}>
              <span>
                <Aperture size={16} aria-hidden="true" />
                {t("pages.auth.login.visual.image")}
              </span>
              <span>
                <Film size={16} aria-hidden="true" />
                {t("pages.auth.login.visual.video")}
              </span>
            </div>
          </div>
        </section>
        <section
          className={styles.formSection}
          aria-label={t("pages.auth.login.title")}
        >
          <div className={styles.formMark} aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div className={styles.forms}>{children}</div>
          <p className={styles.formNote}>{t("pages.auth.login.visual.note")}</p>
        </section>
      </div>
      <footer className={styles.footer}>
        <span>{t("pages.auth.login.visual.footer")}</span>
        <span aria-hidden="true">PERPIX AI</span>
      </footer>
    </main>
  );
}
