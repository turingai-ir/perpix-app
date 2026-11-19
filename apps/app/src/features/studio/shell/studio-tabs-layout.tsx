import type { FC } from "react";
import { Outlet } from "react-router";

import { StudioDesktopNav } from "./studio-desktop-nav";
import { StudioTabBar } from "./studio-tab-bar";

/** The screens that share the tab bar (bottom on a phone, top on a large screen); the editor does not. */
export const StudioTabsLayout: FC = () => (
  <>
    <StudioDesktopNav />
    <div className="flex min-h-0 flex-1 flex-col">
      <Outlet />
    </div>
    <StudioTabBar />
  </>
);
