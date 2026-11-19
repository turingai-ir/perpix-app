import type { FC } from "react";
import { NavLink, useNavigate } from "react-router";
import { Clapperboard, LogOut } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import { STUDIO_TABS } from "./studio-tabs";

/** The studio's top bar on a large screen, where the bottom tab bar would sit far from the pointer. */
export const StudioDesktopNav: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();

  return (
    <nav
      aria-label={t("features.studio.shell.tabs.label")}
      className="bg-background/95 hidden h-14 shrink-0 items-center gap-6 border-b px-6 backdrop-blur lg:flex"
    >
      <span className="font-heading flex items-center gap-2 text-base font-semibold">
        <Clapperboard className="text-primary size-5" aria-hidden />
        {t("features.studio.shell.brand")}
      </span>
      <div className="flex items-center gap-1">
        {STUDIO_TABS.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            replace
            className={({ isActive }) =>
              cn(
                "focus-visible:ring-ring flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover-capable:hover:bg-muted hover-capable:hover:text-foreground",
              )
            }
          >
            <Icon className="size-4" aria-hidden />
            {t(labelKey)}
          </NavLink>
        ))}
      </div>
      <Button
        variant="ghost"
        className="ms-auto min-h-10 gap-2"
        onClick={() => navigate(APP_ROUTES_KEY.app.path)}
      >
        <LogOut className="size-4 rtl:rotate-180" aria-hidden />
        {t("features.studio.shell.exit")}
      </Button>
    </nav>
  );
};
