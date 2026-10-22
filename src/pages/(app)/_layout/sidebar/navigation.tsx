import { type ComponentType, type FC } from "react";
import { NavLink } from "react-router";
import {
  EditorIcon,
  GalleryIcon,
  HomeIcon,
  ImageIcon,
  VideoIcon,
} from "./menu-icons";
import styles from "./sidebar.module.css";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_ROUTES_KEY } from "@/router/routes";
import { APP_I18_KEYS } from "@/services/i18";

type SidebarMenuItem = {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  tone: "neutralLink" | "imageLink" | "videoLink";
  badge?: string;
};

const AppLayoutSidebarNavigation: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const menuItems: SidebarMenuItem[] = [
    {
      key: "home",
      label: t("pages.app.layout.sidebar.menu.home.label"),
      href: APP_ROUTES_KEY.app.path,
      Icon: HomeIcon,
      tone: "neutralLink",
    },
    {
      key: "image-generations",
      label: t("pages.app.layout.sidebar.menu.imageGeneration.label"),
      href: APP_ROUTES_KEY.generation.image.path,
      Icon: ImageIcon,
      tone: "imageLink",
    },
    {
      key: "video-generation",
      label: t("pages.app.layout.sidebar.menu.videoGeneration.label"),
      href: APP_ROUTES_KEY.generation.video.path,
      Icon: VideoIcon,
      tone: "videoLink",
    },
    {
      key: "gallery",
      label: t("pages.app.layout.sidebar.menu.gallery.label"),
      href: APP_ROUTES_KEY.gallery.path,
      Icon: GalleryIcon,
      tone: "neutralLink",
    },
    {
      key: "editor",
      label: t("pages.app.layout.sidebar.menu.editor.label"),
      href: APP_ROUTES_KEY.editor.path,
      Icon: EditorIcon,
      tone: "neutralLink",
      badge: t("pages.app.layout.sidebar.menu.editor.badge"),
    },
  ];

  return (
    <ul className={styles.navigation}>
      {menuItems.map(({ key, label, href, Icon, tone, badge }) => (
        <li
          key={key}
          className={cn(
            styles.navigationItem,
            key === "gallery" && styles.navigationGroupStart,
          )}
        >
          <NavLink
            to={href}
            end={key === "home"}
            className={({ isActive }) =>
              cn(
                styles.navigationLink,
                styles[tone],
                isActive && styles.navigationLinkActive,
              )
            }
          >
            <span className={styles.navigationIcon}>
              <Icon aria-hidden className={styles.navigationIconSvg} />
            </span>
            <span className={styles.navigationLabel}>{label}</span>
            {badge ? (
              <span className={styles.navigationBadge}>{badge}</span>
            ) : null}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default AppLayoutSidebarNavigation;
