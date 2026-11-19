import type { FC, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";

/** How wide a screen's content may grow on a large display; a phone is always full width. */
const WIDTHS = {
  narrow: "lg:max-w-3xl",
  wide: "lg:max-w-6xl",
  full: "",
} as const;

interface StudioScreenProps {
  title: string;
  /** A back arrow is shown when this is given. */
  onBack?: () => void;
  /** Controls at the far end of the header. */
  actions?: ReactNode;
  /** Pinned under the content, above the safe area (a tab bar or a primary action). */
  footer?: ReactNode;
  /**
   * `page` scrolls its content inside a width limit; `canvas` hands the whole
   * space to the screen, which lays itself out (the editor).
   */
  layout?: "page" | "canvas";
  width?: keyof typeof WIDTHS;
  /** Classes for the content area. */
  className?: string;
  children: ReactNode;
}

/**
 * One screen of the studio: a header, a body, and an optional pinned footer.
 * Safe areas are handled here so no screen repeats them.
 */
export const StudioScreen: FC<StudioScreenProps> = ({
  title,
  onBack,
  actions,
  footer,
  layout = "page",
  width = "wide",
  className,
  children,
}) => {
  const { t } = useAppTranslate();
  const limit = layout === "canvas" ? WIDTHS.full : WIDTHS[width];

  return (
    <>
      <header
        className={cn(
          "shrink-0 pt-[env(safe-area-inset-top)]",
          layout === "canvas" && "lg:border-b",
        )}
      >
        <div
          className={cn(
            "mx-auto flex min-h-14 w-full items-center gap-1 px-2 lg:min-h-16 lg:px-6",
            limit,
          )}
        >
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="size-11 rounded-full"
              aria-label={t("features.studio.shell.back")}
              onClick={onBack}
            >
              <ArrowRight className="size-5 ltr:rotate-180 rtl:rotate-0" />
            </Button>
          )}
          <h1 className="font-heading min-w-0 flex-1 truncate px-2 text-lg font-semibold lg:text-xl">
            {title}
          </h1>
          {actions}
        </div>
      </header>
      {layout === "canvas" ? (
        <main className={cn("flex min-h-0 flex-1 flex-col", className)}>
          {children}
        </main>
      ) : (
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={cn(
              "mx-auto h-full w-full px-4 pb-4 lg:px-6 lg:py-6",
              limit,
              className,
            )}
          >
            {children}
          </div>
        </main>
      )}
      {footer}
    </>
  );
};
