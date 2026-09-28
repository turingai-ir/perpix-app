import { RefreshCw, Search } from "lucide-react";
import { useAppTranslate } from "@/hooks";

type FilterKey =
  | "all"
  | "PAID"
  | "PENDING"
  | "FAILED"
  | "DEPOSIT"
  | "WITHDRAW"
  | "REFUND";
type Props = {
  options: readonly FilterKey[];
  selected: string;
  search: string;
  onSelect: (value: FilterKey) => void;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  fetching: boolean;
};

export function FinanceToolbar({
  options,
  selected,
  search,
  onSelect,
  onSearch,
  onRefresh,
  fetching,
}: Props) {
  const { t } = useAppTranslate();
  return (
    <div className="finance-toolbar">
      <div
        className="finance-filters"
        role="group"
        aria-label={t("pages.profile.finance.filters")}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
          >
            {t(`pages.profile.finance.${option}`)}
          </button>
        ))}
      </div>
      <div className="finance-search-actions">
        <label className="finance-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">{t("pages.profile.finance.search")}</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={t("pages.profile.finance.searchPlaceholder")}
          />
        </label>
        <button
          className="finance-icon-button"
          type="button"
          onClick={onRefresh}
          disabled={fetching}
          aria-label={t("pages.profile.finance.refresh")}
        >
          <RefreshCw size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
