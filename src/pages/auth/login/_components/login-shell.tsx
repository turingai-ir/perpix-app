import type { PropsWithChildren } from "react";
import { Aperture, Film } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "../login.module.css";
import LoginArtwork from "./login-artwork";
import AuthCelebration from "./auth-celebration";

interface LoginShellProps extends PropsWithChildren {
  celebrating?: boolean;
}

export default function LoginShell({
  children,
  celebrating = false,
}: LoginShellProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <main className={styles.page}>
      {celebrating ? <AuthCelebration /> : null}
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
          <div className={styles.formMasthead}>
            <span className={styles.liveSignal} aria-hidden="true" />
            <span>{t("pages.auth.login.visual.entryLabel")}</span>
            <span className={styles.formMastheadIndex} aria-hidden="true">
              P/01
            </span>
          </div>
          <div className={styles.forms}>{children}</div>
          <div className={styles.formEndnote}>
            <span aria-hidden="true">✳</span>
            <p className={styles.formNote}>
              {t("pages.auth.login.visual.note")}
            </p>
          </div>
        </section>
      </div>
      <footer className={styles.footer}>
        <span>{t("pages.auth.login.visual.footer")}</span>
        <span aria-hidden="true">PERPIX AI</span>
      </footer>
    </main>
  );
}
