import { type FC } from "react";

import AppLayoutSidebarUserActions from "./user-actions";
import AppLayoutSidebarUserProfileMenu from "./user-profile-menu";

import { PwaInstallIosDialog, usePwaInstall } from "@/feature/pwa";

const AppLayoutSidebarUserMenu: FC = () => {
  const pwaInstall = usePwaInstall();

  return (
    <>
      <div className="mt-auto flex w-full flex-col gap-4">
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
