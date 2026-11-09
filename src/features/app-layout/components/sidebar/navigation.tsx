import { type ComponentType, type FC } from "react";
import { NavLink } from "react-router";
import {
  EditorIcon,
  GalleryIcon,
  HomeIcon,
  ImageIcon,
  VideoIcon,
} from "./menu-icons";
import { IconTile } from "./sidebar-parts";
import { useAppTranslate } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { APP_I18_KEYS } from "@/shared/i18n";

type SidebarMenuItem = {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  tone: "neutral" | "image" | "video";
  badge?: string;
};

const NAV_LINK_CLASS = [
  "group/link relative flex min-h-14 w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-foreground/10 px-2 py-1.5 text-muted-foreground no-underline backdrop-blur-lg",
  "bg-linear-110 from-foreground/6 to-foreground/2 to-65% shadow-[inset_0_1px_rgb(255_255_255/7%),0_8px_20px_rgb(0_0_0/8%)]",
  "[--item-accent:var(--primary)] [--item-glow:color-mix(in_srgb,var(--primary)_15%,transparent)]",
  "data-[tone=image]:[--item-accent:var(--image-accent)] data-[tone=image]:[--item-glow:var(--image-accent-soft)]",
  "data-[tone=video]:[--item-accent:var(--video-accent)] data-[tone=video]:[--item-glow:var(--video-accent-soft)]",
  "transition-[border-color,background-color,color,transform,box-shadow] duration-200 ease-out-quint",
  "before:absolute before:inset-y-1/4 before:start-0 before:w-0.5 before:scale-y-[0.55] before:rounded-full before:bg-(--item-accent) before:opacity-0 before:shadow-[0_0_13px_var(--item-accent)] before:transition-[opacity,transform] before:duration-200 before:content-['']",
  "aria-[current=page]:border-[color-mix(in_srgb,var(--item-accent)_32%,transparent)] aria-[current=page]:bg-linear-110 aria-[current=page]:from-(--item-glow) aria-[current=page]:to-foreground/4 aria-[current=page]:to-80% aria-[current=page]:text-foreground aria-[current=page]:shadow-[inset_0_1px_rgb(255_255_255/13%),0_9px_26px_var(--item-glow)] aria-[current=page]:before:scale-y-100 aria-[current=page]:before:opacity-100",
  "hover-capable:hover:-translate-x-0.5 hover-capable:hover:border-[color-mix(in_srgb,var(--item-accent)_30%,transparent)] hover-capable:hover:bg-foreground/6 hover-capable:hover:text-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  "motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:hover:translate-x-0",
].join(" ");

const NAV_ICON_CLASS =
  "size-10 rounded-xl border-[color-mix(in_srgb,var(--item-accent)_20%,transparent)] bg-linear-[145deg] from-(--item-glow) to-foreground/2 text-(--item-accent) shadow-[inset_0_1px_rgb(255_255_255/8%)] transition-[transform,box-shadow] duration-200 ease-out-quint hover-capable:group-hover/link:scale-105 hover-capable:group-hover/link:shadow-[0_0_18px_var(--item-glow),inset_0_1px_rgb(255_255_255/12%)] motion-reduce:transition-none motion-reduce:group-hover/link:scale-100";

const AppLayoutSidebarNavigation: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const menuItems: SidebarMenuItem[] = [
    {
      key: "home",
      label: t("pages.app.layout.sidebar.menu.home.label"),
      href: APP_ROUTES_KEY.app.path,
      Icon: HomeIcon,
      tone: "neutral",
    },
    {
      key: "image-generations",
      label: t("pages.app.layout.sidebar.menu.imageGeneration.label"),
      href: APP_ROUTES_KEY.generation.image.path,
      Icon: ImageIcon,
      tone: "image",
    },
    {
      key: "video-generation",
      label: t("pages.app.layout.sidebar.menu.videoGeneration.label"),
      href: APP_ROUTES_KEY.generation.video.path,
      Icon: VideoIcon,
      tone: "video",
    },
    {
      key: "gallery",
      label: t("pages.app.layout.sidebar.menu.gallery.label"),
      href: APP_ROUTES_KEY.gallery.path,
      Icon: GalleryIcon,
      tone: "neutral",
    },
    {
      key: "editor",
      label: t("pages.app.layout.sidebar.menu.editor.label"),
      href: APP_ROUTES_KEY.editor.path,
      Icon: EditorIcon,
      tone: "neutral",
      badge: t("pages.app.layout.sidebar.menu.editor.badge"),
    },
  ];

  return (
    <ul className="m-0 flex min-w-0 list-none flex-col gap-2 p-0">
      {menuItems.map(({ key, label, href, Icon, tone, badge }) => (
        <li
          key={key}
          className={cn(
            "min-w-0",
            key === "gallery" && "border-primary/10 mt-2.5 border-t pt-3.5",
          )}
        >
          <NavLink
            to={href}
            end={key === "home"}
            data-tone={tone}
            className={NAV_LINK_CLASS}
          >
            <IconTile className={NAV_ICON_CLASS}>
              <Icon
                aria-hidden
                className="[&_.icon-accent]:stroke-foreground size-5"
              />
            </IconTile>
            <span className="truncate text-sm font-semibold">{label}</span>
            {badge ? (
              <span className="border-accent-sky/20 bg-accent-sky/10 text-accent-sky ms-auto rounded-full border px-2 py-0.5 text-xs font-semibold">
                {badge}
              </span>
            ) : null}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default AppLayoutSidebarNavigation;
