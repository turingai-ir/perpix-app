import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAppTranslate } from "@/hooks";
import { financeNumber } from "./finance-format";

type PaginationFooterProps = {
  offset: number;
  count: number;
  hasNext: boolean;
  isFetching?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationFooter({
  offset,
  count,
  hasNext,
  isFetching,
  onPrevious,
  onNext,
}: PaginationFooterProps) {
  const { t, i18n } = useAppTranslate();
  return (
    <div className="finance-pagination" data-testid="finance-pagination">
      <div className="text-muted-foreground text-sm">
        {count > 0
          ? t("pages.profile.finance.range", {
              from: financeNumber(offset + 1, i18n.language),
              to: financeNumber(offset + count, i18n.language),
            })
          : t("pages.profile.finance.zeroRecords")}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={offset === 0 || isFetching}
          onClick={onPrevious}
        >
          <ChevronRight className="size-4" />
          {t("pages.profile.finance.previous")}
        </button>
        <button
          type="button"
          disabled={!hasNext || isFetching}
          onClick={onNext}
        >
          {t("pages.profile.finance.next")}
          <ChevronLeft className="size-4" />
        </button>
      </div>
    </div>
  );
}
