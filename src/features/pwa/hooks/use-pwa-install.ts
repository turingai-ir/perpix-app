import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { detectInstallGuide } from "../lib/install-guide";

import { useAppTranslate } from "@/shared/hooks";

type BeforeInstallPromptOutcome = "accepted" | "dismissed";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: BeforeInstallPromptOutcome;
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

const isStandaloneDisplayMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export function usePwaInstall() {
  const { t } = useAppTranslate();
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isInstallPending, setIsInstallPending] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() =>
    isStandaloneDisplayMode(),
  );
  const [guideKind] = useState(() => detectInstallGuide(window.navigator));

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setIsInstallGuideOpen(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const canInstall = useMemo(
    () => !isInstalled && (Boolean(installPrompt) || guideKind !== null),
    [guideKind, installPrompt, isInstalled],
  );

  const requestInstall = useCallback(async () => {
    if (isInstalled || isInstallPending) return;

    if (!installPrompt) {
      if (guideKind) setIsInstallGuideOpen(true);
      return;
    }

    setIsInstallPending(true);
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      toast.error(t("features.pwaInstall.error"));
    } finally {
      // A native offer is one-shot, even when dismissed. Keep any newer offer.
      setInstallPrompt((current) =>
        current === installPrompt ? null : current,
      );
      setIsInstallPending(false);
    }
  }, [guideKind, installPrompt, isInstalled, isInstallPending, t]);

  return {
    canInstall,
    guideKind,
    isInstallPending,
    isInstallGuideOpen,
    requestInstall,
    setIsInstallGuideOpen,
  };
}
