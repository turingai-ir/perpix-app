import type { FC, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";

interface StudioScreenProps {
  title: string;
  /** A back arrow is shown when this is given. */
  onBack?: () => void;
  /** Controls at the far end of the header (the thumb-unfriendly corner: keep to one or two). */
  actions?: ReactNode;
  /** Pinned under the content, above the safe area (a tab bar or a primary action). */
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * One screen of the studio: a header, a body that scrolls on its own, and an
 * optional pinned footer. Safe areas are handled here so no screen repeats
 * them.
 */
export const StudioScreen: FC<StudioScreenProps> = ({
  title,
  onBack,
  actions,
  footer,
  className,
  children,
}) => {
  const { t } = useAppTranslate();

  return (
    <>
      <header className="flex min-h-14 shrink-0 items-center gap-1 px-2 pt-[env(safe-area-inset-top)]">
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
        <h1 className="font-heading min-w-0 flex-1 truncate px-2 text-lg font-semibold">
          {title}
        </h1>
        {actions}
      </header>
      <main
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4",
          className,
        )}
      >
        {children}
      </main>
      {footer}
    </>
  );
};
