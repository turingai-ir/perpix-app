import { type FC } from "react";
import { useNavigate } from "react-router";
import { BadgeCheck, ChevronsUpDown, Download, LogOut } from "lucide-react";

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
import { usePwaInstall } from "@/feature/pwa";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";
import { APP_KEYS } from "@/utils";
import { cookies } from "@/utils/cookies";

const AppLayoutSidebarUserProfileMenu: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const pwaInstall = usePwaInstall();
  const activeSubscriptionState = useActiveSubscription();
  const planName =
    activeSubscriptionState.data?.plan.display_name ??
    t("features.pricing.plans.free.title");

  const handleLogout = () => {
    cookies().remove(APP_KEYS.COOKIES.ACCESS_TOKEN);
    navigate(APP_ROUTES_KEY.auth.login.path);
  };

  return (
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
          <DropdownMenuItem>
            {t("common.appVersion", { version: __APP_VERSION__ })}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            {t("pages.app.layout.sidebar.user.logout")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppLayoutSidebarUserProfileMenu;
