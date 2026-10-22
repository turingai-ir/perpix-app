import { type FC } from "react";

import AppLayoutSidebarUserActions from "./user-actions";
import AppLayoutSidebarUserProfileMenu from "./user-profile-menu";
import styles from "./sidebar.module.css";

import { PwaInstallIosDialog, usePwaInstall } from "@/feature/pwa";

const AppLayoutSidebarUserMenu: FC = () => {
  const pwaInstall = usePwaInstall();

  return (
    <>
      <div className={styles.userDock}>
        <AppLayoutSidebarUserActions />
        <AppLayoutSidebarUserProfileMenu />
      </div>
      <PwaInstallIosDialog
        open={pwaInstall.isIosGuideOpen}
        onOpenChange={pwaInstall.setIsIosGuideOpen}
      />
    </>
  );
};

export default AppLayoutSidebarUserMenu;
