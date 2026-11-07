import { Search, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

type FinanceFilter = { value: string; label: string };

type FinanceToolbarProps = {
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  filtersLabel: string;
  filters: FinanceFilter[];
  activeFilter: string;
  resultLabel: string;
  clearLabel: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onClear: () => void;
};

export function FinanceToolbar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  filtersLabel,
  filters,
  activeFilter,
  resultLabel,
  clearLabel,
  onSearchChange,
  onFilterChange,
  onClear,
}: FinanceToolbarProps) {
  const hasFilters = searchValue.length > 0 || activeFilter !== "all";

  return (
    <div className="border-border grid grid-cols-1 gap-3 border-b px-4 pb-4 sm:px-6 sm:pb-5 md:grid-cols-[minmax(16rem,1fr)_auto] md:items-center">
      <div className="relative">
        <label className="sr-only" htmlFor="finance-history-search">
          {searchLabel}
        </label>
        <Search
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 z-1 size-4 -translate-y-1/2"
        />
        <Input
          id="finance-history-search"
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="h-12 rounded-[0.9rem] bg-[color-mix(in_oklab,var(--muted)_42%,var(--card))] ps-10 text-base md:text-sm"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <fieldset className="flex min-w-0 [scrollbar-width:none] gap-2 overflow-x-auto p-0.5 [&::-webkit-scrollbar]:hidden">
        <legend className="sr-only">{filtersLabel}</legend>
        {filters.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            variant="ghost"
            aria-pressed={activeFilter === filter.value}
            className={cn(
              "min-h-11 flex-none rounded-[0.85rem] border border-transparent px-3.5",
              activeFilter === filter.value &&
                "border-[color-mix(in_oklab,var(--finance-accent)_24%,transparent)] bg-(--finance-accent-soft) text-(--finance-accent)",
            )}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </fieldset>
      <div
        className="text-muted-foreground flex min-h-9 items-center justify-between gap-3 text-xs md:col-span-full"
        role="status"
      >
        <span>{resultLabel}</span>
        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            className="min-h-10 text-(--finance-accent)"
            onClick={onClear}
          >
            <X aria-hidden="true" />
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
