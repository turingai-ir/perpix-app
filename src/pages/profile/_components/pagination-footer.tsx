import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";

type PaginationFooterProps = {
  offset: number;
  itemCount: number;
  hasNext: boolean;
  isFetching?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationFooter({
  offset,
  itemCount,
  hasNext,
  isFetching,
  onPrevious,
  onNext,
}: PaginationFooterProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const from = itemCount === 0 ? 0 : offset + 1;
  const to = offset + itemCount;

  return (
    <nav
      className="border-border flex flex-col items-stretch justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:items-center"
      aria-label={t("pages.profile.finance.range", {
        from: formatLocalizedNumber({ value: from }),
        to: formatLocalizedNumber({ value: to }),
      })}
    >
      <div className="text-muted-foreground text-sm">
        {t("pages.profile.finance.range", {
          from: formatLocalizedNumber({ value: from }),
          to: formatLocalizedNumber({ value: to }),
        })}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={offset === 0 || isFetching}
          onClick={onPrevious}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
          {t("pages.profile.finance.previous")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!hasNext || isFetching}
          onClick={onNext}
        >
          {t("pages.profile.finance.next")}
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
