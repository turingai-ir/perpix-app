import { type FC } from "react";
import { TbCameraAi, TbPhotoAi } from "react-icons/tb";
import { Link, useNavigate } from "react-router";
import {
  BadgeCheck,
  ChevronsUpDown,
  Download,
  Images,
  LogOut,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";

import AppLayoutSidebarWallet from "./wallet";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { APP_KEYS } from "@/utils";
import { APP_ROUTES_KEY } from "@/router/routes";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cookies } from "@/utils/cookies";
import { useActiveSubscription, usePricingFeature } from "@/feature/pricing";
import AppLayoutSidebarHistory from "./history";
import { useSupportChatWidget } from "@/feature/support-chat";
import { PwaInstallIosDialog, usePwaInstall } from "@/feature/pwa";

const AppLayoutSidebarContent: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const cookie = cookies();
  const { openChatWidget } = useSupportChatWidget();
  const { openPricingFeature } = usePricingFeature();
  const pwaInstall = usePwaInstall();

  const activeSubscriptionState = useActiveSubscription();

  const handleLogout = () => {
    cookie.remove(APP_KEYS.COOKIES.ACCESS_TOKEN);
    navigate(APP_ROUTES_KEY.auth.login.path);
  };

  const menuItems = [
    {
      key: "image-generations",
      label: t("pages.app.layout.sidebar.menu.imageGeneration.label"),
      href: APP_ROUTES_KEY.generation.image.path,
      Icon: TbPhotoAi,
    },
    {
      key: "video-generation",
      label: t("pages.app.layout.sidebar.menu.videoGeneration.label"),
      href: APP_ROUTES_KEY.generation.video.path,
      Icon: TbCameraAi,
    },
    {
      key: "gallery",
      label: t("pages.app.layout.sidebar.menu.gallery.label"),
      href: APP_ROUTES_KEY.gallery.path,
      Icon: Images,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-auto p-2">
      <AppLayoutSidebarWallet />

      <nav
        aria-label={t("pages.app.layout.sidebar.balanceCard.actions.label")}
        className="flex flex-col gap-4"
      >
        <ul className="flex flex-col gap-1.5">
          {menuItems.map(({ key, label, href, Icon }) => (
            <li key={key}>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <Link to={href}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  {label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>

        <Separator />
        <AppLayoutSidebarHistory />
      </nav>
      <div className="mt-auto flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-2">
          {activeSubscriptionState.data?.plan.is_default ? (
            <>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => {
                  openPricingFeature();
                }}
              >
                <Sparkles />
                {t("pages.app.layout.sidebar.user.upgrade")}
              </Button>
            </>
          ) : null}
          <Button
            className="w-full justify-start"
            variant="ghost"
            onClick={() => {
              openChatWidget();
            }}
          >
            <MessageCircle />
            {t("pages.app.layout.sidebar.user.support")}
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="mt-auto">
            <Button
              variant="ghost"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage />
                <AvatarFallback className="rounded-lg">
                  <UserRound />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 text-right text-sm leading-tight">
                <Badge>
                  {activeSubscriptionState.data?.plan.display_name ??
                    t("features.pricing.plans.free.title")}
                </Badge>
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
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage />
                  <AvatarFallback className="rounded-lg">
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 text-right text-sm leading-tight">
                  <Badge>
                    {activeSubscriptionState.data?.plan.display_name ??
                      t("features.pricing.plans.free.title")}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  navigate(APP_ROUTES_KEY.profile.root.path);
                }}
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
      </div>
      <PwaInstallIosDialog
        open={pwaInstall.isIosGuideOpen}
        onOpenChange={pwaInstall.setIsIosGuideOpen}
      />
    </div>
  );
};

export default AppLayoutSidebarContent;
