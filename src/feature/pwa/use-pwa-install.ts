import { useCallback, useEffect, useMemo, useState } from "react";

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

const isIosDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();
  const hasTouchPoints = window.navigator.maxTouchPoints > 1;

  return (
    /iphone|ipod|ipad/.test(userAgent) ||
    (platform === "macintel" && hasTouchPoints)
  );
};

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() =>
    isStandaloneDisplayMode()
  );
  const [isIos] = useState(() => isIosDevice());

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setIsIosGuideOpen(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const canInstall = useMemo(
    () => !isInstalled && (Boolean(installPrompt) || isIos),
    [installPrompt, isInstalled, isIos]
  );

  const requestInstall = useCallback(async () => {
    if (isIos) {
      setIsIosGuideOpen(true);
      return;
    }

    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome !== "dismissed") {
      setInstallPrompt(null);
    }
  }, [installPrompt, isIos]);

  return {
    canInstall,
    isIosGuideOpen,
    requestInstall,
    setIsIosGuideOpen,
  };
}
