import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useReducedMotion } from "motion/react";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { useAppReady } from "./use-app-ready";

export type ReadySource = Parameters<typeof useAppReady>[0];

export interface UseBootSplashOptions {
  router: ReadySource;
  onVisibilityChange: (visible: boolean) => void;
}

export function useBootSplash({
  router,
  onVisibilityChange,
}: UseBootSplashOptions) {
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

  const handleSkip = () => {
    setSkip(true);
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    setSkip(true);
  };

  return {
    t,
    dialog,
    leaving,
    bypass,
    handleSkip,
    handleCancel,
  };
}
