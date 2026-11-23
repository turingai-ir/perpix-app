import type { FC } from "react";
import { Outlet, useLocation } from "react-router";

import { TooltipProvider } from "@/shared/ui/tooltip";

/**
 * The studio is an app inside the app: it fills the screen and has no
 * sidebar. It is designed on a phone first, where it is the whole viewport.
 * On a tablet the same screens sit in a centred column; from a laptop up the
 * column opens to the full window and each screen lays itself out for the
 * space (a grid of projects, an editor with a side panel).
 */
export const StudioShell: FC = () => {
  const { pathname } = useLocation();

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh w-full justify-center bg-muted/40">
        <div className="relative flex h-dvh w-full max-w-2xl flex-col overflow-hidden bg-background md:border-x lg:max-w-none lg:border-x-0">
          {/* Keyed by route so each screen enters on its own; a reduced-motion preference turns the animation off globally. */}
          <div
            key={pathname}
            className="flex min-h-0 flex-1 animate-in flex-col duration-200 fade-in-0 ltr:slide-in-from-right-4 lg:ltr:slide-in-from-right-0 rtl:slide-in-from-left-4 lg:rtl:slide-in-from-left-0"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
