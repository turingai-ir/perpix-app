import type { FC } from "react";
import { NavLink } from "react-router";

import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import { STUDIO_TABS } from "./studio-tabs";

/** The bottom tab bar of the studio's home screens, inside the thumb's reach. */
export const StudioTabBar: FC = () => {
  const { t } = useAppTranslate();

  return (
    <nav
      aria-label={t("features.studio.shell.tabs.label")}
      className="bg-background/95 flex shrink-0 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {STUDIO_TABS.map(({ to, labelKey, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          replace
          className={({ isActive }) =>
            cn(
              "focus-visible:ring-ring flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset active:scale-[0.97]",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          <Icon className="size-5" aria-hidden />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  );
};
