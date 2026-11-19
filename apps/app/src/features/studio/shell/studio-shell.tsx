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
      <div className="bg-muted/40 flex min-h-dvh w-full justify-center">
        <div className="bg-background relative flex h-dvh w-full max-w-2xl flex-col overflow-hidden md:border-x lg:max-w-none lg:border-x-0">
          {/* Keyed by route so each screen enters on its own; a reduced-motion preference turns the animation off globally. */}
          <div
            key={pathname}
            className="animate-in fade-in-0 ltr:slide-in-from-right-4 rtl:slide-in-from-left-4 lg:ltr:slide-in-from-right-0 lg:rtl:slide-in-from-left-0 flex min-h-0 flex-1 flex-col duration-200"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
