import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatLocalizedNumber } from "@/utils";

type PaginationFooterProps = {
  offset: number;
  limit: number;
  hasNext: boolean;
  isFetching?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationFooter({
  offset,
  limit,
  hasNext,
  isFetching,
  onPrevious,
  onNext,
}: PaginationFooterProps) {
  return (
    <div className="border-border flex flex-col items-stretch justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:items-center">
      <div className="text-muted-foreground text-sm">
        {formatLocalizedNumber({ value: offset + 1 })} تا{" "}
        {formatLocalizedNumber({ value: offset + limit })}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={offset === 0 || isFetching}
          onClick={onPrevious}
        >
          <ChevronRight className="size-4" />
          قبلی
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!hasNext || isFetching}
          onClick={onNext}
        >
          بعدی
          <ChevronLeft className="size-4" />
        </Button>
      </div>
    </div>
  );
}
