import { useEffect, useRef, type FC } from "react";

import AppLayoutSidebarUserActions from "./user-actions";
import AppLayoutSidebarUserProfileMenu from "./user-profile-menu";
import styles from "./sidebar.module.css";

import { PwaInstallIosDialog, usePwaInstall } from "@/features/pwa";

const AppLayoutSidebarUserMenu: FC = () => {
  const pwaInstall = usePwaInstall();
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const wasIosGuideOpen = useRef(false);

  useEffect(() => {
    const shouldRestoreFocus =
      wasIosGuideOpen.current && !pwaInstall.isIosGuideOpen;
    wasIosGuideOpen.current = pwaInstall.isIosGuideOpen;
    if (!shouldRestoreFocus) return;

    // The install menu item is removed when its dropdown closes.
    const frame = requestAnimationFrame(() => profileTriggerRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [pwaInstall.isIosGuideOpen]);

  return (
    <>
      <div className={styles.userDock}>
        <AppLayoutSidebarUserActions />
        <AppLayoutSidebarUserProfileMenu
          canInstall={pwaInstall.canInstall}
          isInstallPending={pwaInstall.isInstallPending}
          isIosGuideOpen={pwaInstall.isIosGuideOpen}
          requestInstall={pwaInstall.requestInstall}
          triggerRef={profileTriggerRef}
        />
      </div>
      <PwaInstallIosDialog
        open={pwaInstall.isIosGuideOpen}
        onOpenChange={pwaInstall.setIsIosGuideOpen}
      />
    </>
  );
};

export default AppLayoutSidebarUserMenu;
