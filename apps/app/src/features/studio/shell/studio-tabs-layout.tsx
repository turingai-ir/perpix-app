import type { FC } from "react";
import { Outlet } from "react-router";

import { StudioTabBar } from "./studio-tab-bar";

/** The screens that share the bottom tab bar; the editor and export do not. */
export const StudioTabsLayout: FC = () => (
  <>
    <div className="flex min-h-0 flex-1 flex-col">
      <Outlet />
    </div>
    <StudioTabBar />
  </>
);
