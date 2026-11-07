import type { FC, RefObject } from "react";
import { useNavigate } from "react-router";
import { ChevronsUpDown, Crown, Download, LogOut } from "lucide-react";

import { AccountIcon } from "./menu-icons";
import AppLayoutSidebarUserAvatar from "./user-avatar";
import styles from "./sidebar.module.css";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useActiveSubscription, usePricingFeature } from "@/feature/pricing";
import { useSignOutActions } from "@/features/auth";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { APP_I18_KEYS } from "@/shared/i18n";

type UserProfileMenuProps = {
  canInstall: boolean;
  isInstallPending: boolean;
  isIosGuideOpen: boolean;
  requestInstall: () => Promise<void>;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const AppLayoutSidebarUserProfileMenu: FC<UserProfileMenuProps> = ({
  canInstall,
  isInstallPending,
  isIosGuideOpen,
  requestInstall,
  triggerRef,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const signOutActions = useSignOutActions();
  const activeSubscriptionState = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();
  const planName =
    activeSubscriptionState.data?.plan.display_name ??
    t("features.pricing.plans.free.title");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="mt-auto"
        render={
          <Button
            ref={triggerRef}
            variant="ghost"
            size="lg"
            className={styles.profileTrigger}
          />
        }
      >
        <AppLayoutSidebarUserAvatar />
        <div className={styles.profileText}>
          <span>{t("pages.app.layout.sidebar.user.account")}</span>
          <small>{planName}</small>
        </div>
        <ChevronsUpDown className={styles.profileChevron} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        positionerClassName="z-[70]"
        className={`${styles.profileDropdown} z-[70] w-(--anchor-width) min-w-56`}
        side="top"
        align="end"
        sideOffset={8}
        // Let the guide take focus instead of the closing dropdown.
        finalFocus={!isIosGuideOpen}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className={styles.profileDropdownHeader}>
            <div className={styles.profileDropdownIdentity}>
              <AppLayoutSidebarUserAvatar />
              <div className={styles.profileText}>
                <span>{t("pages.app.layout.sidebar.user.membership")}</span>
                <small className={styles.profilePlan}>{planName}</small>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup className={styles.profileDropdownItems}>
          <DropdownMenuItem
            className={styles.profileMenuItem}
            onClick={() => navigate(APP_ROUTES_KEY.profile.root.path)}
          >
            <span className={styles.profileMenuIcon}>
              <AccountIcon aria-hidden="true" />
            </span>
            <span>{t("pages.app.layout.sidebar.user.manageAccount")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={styles.profileMenuItem}
            onClick={() => openPricingFeature()}
          >
            <span className={styles.profileMenuIcon}>
              <Crown aria-hidden="true" />
            </span>
            <span>{t("pages.app.layout.sidebar.user.plan.manage")}</span>
          </DropdownMenuItem>
          {canInstall ? (
            <DropdownMenuItem
              className={`${styles.profileMenuItem} ${styles.profileMenuItemInstall}`}
              disabled={isInstallPending}
              onClick={() => void requestInstall()}
            >
              <span className={styles.profileMenuIcon}>
                <Download aria-hidden="true" />
              </span>
              <span>{t("features.pwaInstall.action")}</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            className={`${styles.profileMenuItem} ${styles.profileMenuItemExit}`}
            disabled={signOutActions.isPending}
            onClick={() => void signOutActions.signOut()}
          >
            <span className={styles.profileMenuIcon}>
              <LogOut aria-hidden="true" />
            </span>
            <span>{t("pages.app.layout.sidebar.user.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppLayoutSidebarUserProfileMenu;
