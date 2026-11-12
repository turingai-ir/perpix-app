import { useEffect, useRef, type FC } from "react";

import AppLayoutSidebarUserActions from "./user-actions";
import AppLayoutSidebarUserProfileMenu from "./user-profile-menu";

import type { usePwaInstall } from "@/features/pwa";

export type PwaInstallState = ReturnType<typeof usePwaInstall>;

const AppLayoutSidebarUserMenu: FC<{ pwaInstall: PwaInstallState }> = ({
  pwaInstall,
}) => {
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const wasInstallGuideOpen = useRef(false);

  useEffect(() => {
    const shouldRestoreFocus =
      wasInstallGuideOpen.current && !pwaInstall.isInstallGuideOpen;
    wasInstallGuideOpen.current = pwaInstall.isInstallGuideOpen;
    if (!shouldRestoreFocus) return;

    // The install menu item is removed when its dropdown closes.
    const frame = requestAnimationFrame(() =>
      profileTriggerRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [pwaInstall.isInstallGuideOpen]);

  return (
    <div className="mt-auto flex w-full flex-col gap-2.5 pt-2">
      <AppLayoutSidebarUserActions />
      <AppLayoutSidebarUserProfileMenu
        canInstall={pwaInstall.canInstall}
        isInstallPending={pwaInstall.isInstallPending}
        isInstallGuideOpen={pwaInstall.isInstallGuideOpen}
        requestInstall={pwaInstall.requestInstall}
        triggerRef={profileTriggerRef}
      />
    </div>
  );
};

export default AppLayoutSidebarUserMenu;
