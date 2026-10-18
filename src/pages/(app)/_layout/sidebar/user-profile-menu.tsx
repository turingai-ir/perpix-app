import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import {
  BadgeCheck,
  ChevronsUpDown,
  Download,
  KeyRound,
  LogOut,
  LogOutIcon,
} from "lucide-react";

import AppLayoutSidebarUserAvatar from "./user-avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveSubscription } from "@/feature/pricing";
import { ChangePasswordDialog, useSignOutActions } from "@/features/auth";
import { usePwaInstall } from "@/feature/pwa";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

const AppLayoutSidebarUserProfileMenu: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const signOutActions = useSignOutActions();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const pwaInstall = usePwaInstall();
  const activeSubscriptionState = useActiveSubscription();
  const planName =
    activeSubscriptionState.data?.plan.display_name ??
    t("features.pricing.plans.free.title");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="mt-auto">
          <Button variant="ghost" size="lg">
            <AppLayoutSidebarUserAvatar />
            <div className="flex flex-1 text-right text-sm leading-tight">
              <Badge>{planName}</Badge>
            </div>
            <ChevronsUpDown className="mr-auto size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side="top"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
              <AppLayoutSidebarUserAvatar />
              <div className="flex flex-1 text-right text-sm leading-tight">
                <Badge>{planName}</Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate(APP_ROUTES_KEY.profile.root.path)}
            >
              <BadgeCheck />
              {t("pages.app.layout.sidebar.user.account")}
            </DropdownMenuItem>
            {pwaInstall.canInstall ? (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void pwaInstall.requestInstall();
                }}
              >
                <Download />
                {t("features.pwaInstall.action")}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onSelect={() => setIsChangePasswordOpen(true)}>
              <KeyRound />
              {t("features.auth.changePassword.menu")}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={signOutActions.isPending}
              onSelect={() => void signOutActions.signOutEverywhere()}
            >
              <LogOutIcon />
              {t("features.auth.logoutAll.menu")}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={signOutActions.isPending}
              onSelect={() => void signOutActions.signOut()}
            >
              <LogOut />
              {t("pages.app.layout.sidebar.user.logout")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
};

export default AppLayoutSidebarUserProfileMenu;
