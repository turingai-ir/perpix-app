import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <div className="finance-toolbar">
      <div className="finance-search">
        <label className="sr-only" htmlFor="finance-history-search">
          {searchLabel}
        </label>
        <Search aria-hidden="true" />
        <Input
          id="finance-history-search"
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <fieldset className="finance-filters">
        <legend className="sr-only">{filtersLabel}</legend>
        {filters.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            variant="ghost"
            aria-pressed={activeFilter === filter.value}
            className={cn(
              "finance-filter",
              activeFilter === filter.value && "finance-filter-active",
            )}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </fieldset>
      <div className="finance-toolbar-meta" role="status">
        <span>{resultLabel}</span>
        {hasFilters ? (
          <Button type="button" variant="ghost" onClick={onClear}>
            <X aria-hidden="true" />
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
