import { type ComponentType, type FC } from "react";
import { NavLink } from "react-router";
import { House, Images, WandSparkles } from "lucide-react";
import { TbCameraAi, TbPhotoAi } from "react-icons/tb";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

type SidebarMenuItem = {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  badge?: string;
};

const AppLayoutSidebarNavigation: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const menuItems: SidebarMenuItem[] = [
    {
      key: "home",
      label: t("pages.app.layout.sidebar.menu.home.label"),
      href: APP_ROUTES_KEY.app.path,
      Icon: House,
    },
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
    {
      key: "editor",
      label: t("pages.app.layout.sidebar.menu.editor.label"),
      href: APP_ROUTES_KEY.editor.path,
      Icon: WandSparkles,
      badge: t("pages.app.layout.sidebar.menu.editor.badge"),
    },
  ];

  return (
    <ul className="flex min-w-0 flex-col gap-1.5">
      {menuItems.map(({ key, label, href, Icon, badge }) => (
        <li
          key={key}
          className={cn(
            "min-w-0",
            key === "gallery" && "border-sidebar-border mt-3 border-t pt-3",
          )}
        >
          <NavLink
            to={href}
            end={key === "home"}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost" }),
                "text-sidebar-foreground/75 hover:text-sidebar-foreground min-h-12 w-full min-w-0 justify-start gap-3 rounded-2xl border border-transparent bg-white/[0.025] px-3 shadow-[inset_0_1px_rgb(255_255_255/0.035)] backdrop-blur-md transition-[color,background-color,border-color,transform] hover:-translate-x-0.5 hover:border-white/10 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-fuchsia-400/45 motion-reduce:transform-none motion-reduce:transition-none",
                key === "image-generations" &&
                  "text-sidebar-foreground border-fuchsia-400/20 bg-fuchsia-400/5 [&>svg]:text-fuchsia-400",
                key === "video-generation" &&
                  "text-sidebar-foreground border-sky-400/20 bg-sky-400/5 [&>svg]:text-sky-400",
                isActive &&
                  "text-sidebar-accent-foreground border-fuchsia-300/15 bg-gradient-to-l from-fuchsia-400/12 via-violet-400/8 to-sky-400/5 shadow-[inset_-2px_0_#d946ef,0_10px_30px_rgb(0_0_0/0.08)]",
              )
            }
          >
            <Icon aria-hidden className="h-5 w-5" />
            <span className="truncate">{label}</span>
            {badge ? (
              <Badge variant="secondary" className="ms-auto">
                {badge}
              </Badge>
            ) : null}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default AppLayoutSidebarNavigation;
