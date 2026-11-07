import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { shouldShowSplash, useAppReady } from "../hooks/use-app-ready";
import { BootOffice } from "./boot-office";
import { BootSplashHud } from "./boot-splash-hud";
import styles from "./boot-office.module.css";

type ReadySource = Parameters<typeof useAppReady>[0];

export function BootSplash({ router }: { router: ReadySource }) {
  const [show, setShow] = useState(shouldShowSplash);
  return show ? (
    <BootSplashOverlay router={router} onVisibilityChange={setShow} />
  ) : null;
}

function BootSplashOverlay({
  router,
  onVisibilityChange,
}: {
  router: ReadySource;
  onVisibilityChange: (visible: boolean) => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const reduceMotion = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const [skip, setSkip] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const bypass = skip || timedOut;
  const fadeOnly = Boolean(reduceMotion) || bypass;
  const ready = useAppReady(router, fadeOnly ? 0 : 1800, true);
  const leaving = ready || bypass;

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  // Route initialization must not leave a native modal blocking the app forever.
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 10_000);
    return () => window.clearTimeout(timer);
  }, []);

  // Assets and transition events must never hold the application behind the splash.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(
      () => {
        dialog.current?.close();
        onVisibilityChange(false);
      },
      fadeOnly ? 180 : 1200,
    );
    return () => window.clearTimeout(timer);
  }, [leaving, fadeOnly, onVisibilityChange]);

  return (
    <dialog
      ref={dialog}
      data-boot-splash
      data-leaving={leaving}
      data-skip={bypass}
      className={styles.overlay}
      aria-label={t("features.bootSplash.loading")}
      onCancel={(event) => {
        event.preventDefault();
        setSkip(true);
      }}
    >
      <BootOffice />
      <BootSplashHud onSkip={() => setSkip(true)} skipped={bypass} />
    </dialog>
  );
}
