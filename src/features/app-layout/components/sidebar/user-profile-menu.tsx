import type { FC, RefObject } from "react";
import { ChevronsUpDown, Crown, Download, LogOut } from "lucide-react";

import { AccountIcon } from "./menu-icons";
import AppLayoutSidebarUserAvatar from "./user-avatar";
import { IconTile } from "./sidebar-parts";
import { GLASS_PRESS_CLASS } from "./sidebar-styles";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useSidebarUserProfile } from "../../hooks/use-sidebar-user-profile";

type UserProfileMenuProps = {
  canInstall: boolean;
  isInstallPending: boolean;
  isIosGuideOpen: boolean;
  requestInstall: () => Promise<void>;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const MENU_ITEM_CLASS =
  "min-h-12 cursor-pointer gap-2.5 rounded-xl border border-transparent px-2 py-1.5 text-xs font-semibold data-highlighted:border-primary/20 data-highlighted:bg-primary/12 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";

const MENU_ICON_CLASS =
  "size-8 rounded-lg border-primary/20 bg-primary/10 text-primary";

type ProfileTextProps = { title: string; subtitle: string; badge?: boolean };

const ProfileText: FC<ProfileTextProps> = ({ title, subtitle, badge }) => (
  <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-right">
    <span className="w-full truncate text-xs font-bold">{title}</span>
    <small
      className={cn(
        "text-muted-foreground w-full truncate text-xs",
        badge &&
          "border-primary/25 bg-primary/13 text-primary w-fit max-w-full rounded-full border px-2 py-0.5",
      )}
    >
      {subtitle}
    </small>
  </div>
);

const AppLayoutSidebarUserProfileMenu: FC<UserProfileMenuProps> = ({
  canInstall,
  isInstallPending,
  isIosGuideOpen,
  requestInstall,
  triggerRef,
}) => {
  const {
    t,
    planName,
    navigateToProfile,
    handleOpenPricing,
    handleSignOut,
    isSignOutPending,
  } = useSidebarUserProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="mt-auto"
        render={
          <Button
            ref={triggerRef}
            variant="ghost"
            size="lg"
            className={cn(
              GLASS_PRESS_CLASS,
              "group/profile border-primary/20 from-primary/13 text-foreground [&_[data-slot=avatar]]:border-primary/30 [&_[data-slot=avatar]]:bg-primary/14 h-auto min-h-14 w-full justify-start gap-3 rounded-2xl border bg-linear-120 to-(--video-accent-soft) px-2.5 py-2 shadow-[inset_0_1px_rgb(255_255_255/12%),0_9px_28px_rgb(0_0_0/13%)] backdrop-blur-lg [&_[data-slot=avatar]]:border",
            )}
          />
        }
      >
        <AppLayoutSidebarUserAvatar />
        <ProfileText
          title={t("pages.app.layout.sidebar.user.account")}
          subtitle={planName}
        />
        <ChevronsUpDown
          className="text-muted-foreground size-4 flex-none transition-transform duration-200 group-data-popup-open/profile:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        positionerClassName="z-70"
        className="border-primary/25 z-70 w-(--anchor-width) min-w-56 rounded-2xl border bg-[radial-gradient(circle_at_85%_0%,var(--ambient-brand),transparent_58%)] p-2 shadow-[0_22px_55px_rgb(0_0_0/48%)] backdrop-blur-xl"
        side="top"
        align="end"
        sideOffset={8}
        finalFocus={!isIosGuideOpen}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="border-primary/12 from-primary/13 rounded-xl border bg-linear-110 to-(--video-accent-soft) p-2.5">
            <div className="[&_[data-slot=avatar]]:border-primary/30 [&_[data-slot=avatar]]:bg-primary/14 flex items-center gap-2.5 [&_[data-slot=avatar]]:border">
              <AppLayoutSidebarUserAvatar />
              <ProfileText
                title={t("pages.app.layout.sidebar.user.membership")}
                subtitle={planName}
                badge
              />
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mt-2 grid gap-1">
          <DropdownMenuItem
            className={MENU_ITEM_CLASS}
            onClick={navigateToProfile}
          >
            <IconTile data-slot="icon-tile" className={MENU_ICON_CLASS}>
              <AccountIcon aria-hidden="true" />
            </IconTile>
            <span>{t("pages.app.layout.sidebar.user.manageAccount")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={MENU_ITEM_CLASS}
            onClick={handleOpenPricing}
          >
            <IconTile data-slot="icon-tile" className={MENU_ICON_CLASS}>
              <Crown aria-hidden="true" />
            </IconTile>
            <span>{t("pages.app.layout.sidebar.user.plan.manage")}</span>
          </DropdownMenuItem>
          {canInstall ? (
            <DropdownMenuItem
              className={cn(
                MENU_ITEM_CLASS,
                "[&_[data-slot=icon-tile]]:border-accent-sky/25 [&_[data-slot=icon-tile]]:bg-accent-sky/10 [&_[data-slot=icon-tile]]:text-accent-sky",
              )}
              disabled={isInstallPending}
              onClick={() => void requestInstall()}
            >
              <IconTile data-slot="icon-tile" className={MENU_ICON_CLASS}>
                <Download aria-hidden="true" />
              </IconTile>
              <span>{t("features.pwaInstall.action")}</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            className={cn(
              MENU_ITEM_CLASS,
              "text-destructive data-highlighted:bg-destructive/12 [&_[data-slot=icon-tile]]:border-destructive/25 [&_[data-slot=icon-tile]]:bg-destructive/10 [&_[data-slot=icon-tile]]:text-destructive mt-1",
            )}
            disabled={isSignOutPending}
            onClick={handleSignOut}
          >
            <IconTile data-slot="icon-tile" className={MENU_ICON_CLASS}>
              <LogOut aria-hidden="true" />
            </IconTile>
            <span>{t("pages.app.layout.sidebar.user.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppLayoutSidebarUserProfileMenu;
