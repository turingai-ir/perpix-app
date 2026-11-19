import type { FC } from "react";
import { Outlet, useLocation } from "react-router";

import { TooltipProvider } from "@/shared/ui/tooltip";

/**
 * The studio is an app inside the app: it fills the screen and has no
 * sidebar. On a phone it is the whole viewport; on a wider screen the same
 * interface stays a centred column instead of stretching into a web layout.
 */
export const StudioShell: FC = () => {
  const { pathname } = useLocation();

  return (
    <TooltipProvider>
      <div className="bg-muted/40 flex min-h-dvh w-full justify-center">
        <div className="bg-background relative flex h-dvh w-full max-w-[30rem] flex-col overflow-hidden md:border-x">
          {/* Keyed by route so each screen enters on its own; a reduced-motion preference turns the animation off globally. */}
          <div
            key={pathname}
            className="animate-in fade-in-0 ltr:slide-in-from-right-4 rtl:slide-in-from-left-4 flex min-h-0 flex-1 flex-col duration-200"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
