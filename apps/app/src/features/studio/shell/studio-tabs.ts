import { Captions, FolderOpen, type LucideIcon } from "lucide-react";

import { APP_ROUTES_KEY } from "@/app/router/routes";

export interface StudioTab {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  end: boolean;
}

/** The studio's home screens, shown as the bottom tab bar on a phone and as the top bar on a large screen. */
export const STUDIO_TABS: readonly StudioTab[] = [
  {
    to: APP_ROUTES_KEY.studio.path,
    labelKey: "features.studio.shell.tabs.projects",
    icon: FolderOpen,
    end: true,
  },
  {
    to: APP_ROUTES_KEY.studio.styles.path,
    labelKey: "features.studio.shell.tabs.styles",
    icon: Captions,
    end: false,
  },
];
