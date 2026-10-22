import type { FC } from "react";
import { useNavigate } from "react-router";
import { ChevronsUpDown, Download, LogOut } from "lucide-react";

import { AccountIcon } from "./menu-icons";
import AppLayoutSidebarUserAvatar from "./user-avatar";
import styles from "./sidebar.module.css";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveSubscription } from "@/feature/pricing";
import { useSignOutActions } from "@/features/auth";
import { usePwaInstall } from "@/feature/pwa";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

const AppLayoutSidebarUserProfileMenu: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const signOutActions = useSignOutActions();
  const pwaInstall = usePwaInstall();
  const activeSubscriptionState = useActiveSubscription();
  const planName =
    activeSubscriptionState.data?.plan.display_name ??
    t("features.pricing.plans.free.title");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mt-auto">
        <Button variant="ghost" size="lg" className={styles.profileTrigger}>
          <AppLayoutSidebarUserAvatar />
          <div className={styles.profileText}>
            <span>{t("pages.app.layout.sidebar.user.account")}</span>
            <small>{planName}</small>
          </div>
          <ChevronsUpDown
            className={styles.profileChevron}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${styles.profileDropdown} z-[70] w-(--radix-dropdown-menu-trigger-width) min-w-56`}
        side="top"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className={styles.profileDropdownHeader}>
          <div className={styles.profileDropdownIdentity}>
            <AppLayoutSidebarUserAvatar />
            <div className={styles.profileText}>
              <span>{t("pages.app.layout.sidebar.user.account")}</span>
              <small className={styles.profilePlan}>{planName}</small>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup className={styles.profileDropdownItems}>
          <DropdownMenuItem
            className={styles.profileMenuItem}
            onClick={() => navigate(APP_ROUTES_KEY.profile.root.path)}
          >
            <span className={styles.profileMenuIcon}>
              <AccountIcon aria-hidden="true" />
            </span>
            <span>{t("pages.app.layout.sidebar.user.account")}</span>
          </DropdownMenuItem>
          {pwaInstall.canInstall ? (
            <DropdownMenuItem
              className={`${styles.profileMenuItem} ${styles.profileMenuItemInstall}`}
              onSelect={(event) => {
                event.preventDefault();
                void pwaInstall.requestInstall();
              }}
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
            onSelect={() => void signOutActions.signOut()}
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
