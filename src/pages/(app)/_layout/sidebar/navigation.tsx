import { type ComponentType, type FC } from "react";
import { Link } from "react-router";
import { Images, WandSparkles } from "lucide-react";
import { TbCameraAi, TbPhotoAi } from "react-icons/tb";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
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
    <ul className="flex flex-col gap-1.5">
      {menuItems.map(({ key, label, href, Icon, badge }) => (
        <li key={key}>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <Link to={href}>
              <Icon aria-hidden className="h-5 w-5" />
              <span>{label}</span>
              {badge ? (
                <Badge variant="secondary" className="ms-auto">
                  {badge}
                </Badge>
              ) : null}
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default AppLayoutSidebarNavigation;
