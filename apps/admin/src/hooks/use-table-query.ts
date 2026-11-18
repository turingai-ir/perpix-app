import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export interface UseTableQueryOptions<
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  defaultLimit?: number;
  defaultSort?: string;
  defaultFilters?: Partial<TFilters>;
}

export function useTableQuery<
  TFilters extends Record<string, unknown> = Record<string, unknown>,
>(options: UseTableQueryOptions<TFilters> = {}) {
  const {
    defaultLimit = 20,
    defaultSort = "-created_at",
    defaultFilters = {},
  } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse page and limit
  const page = useMemo(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isInteger(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);

  const limit = useMemo(() => {
    const raw = Number(searchParams.get("limit"));
    return Number.isInteger(raw) && raw > 0 ? raw : defaultLimit;
  }, [searchParams, defaultLimit]);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const sort = useMemo(() => {
    return searchParams.get("sort") || defaultSort;
  }, [searchParams, defaultSort]);

  const search = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  // Read all current params as filters
  const filters = useMemo(() => {
    const parsed: Record<string, unknown> = { ...defaultFilters };
    searchParams.forEach((val, key) => {
      if (["page", "limit", "sort", "search"].includes(key)) return;
      if (val === "true") parsed[key] = true;
      else if (val === "false") parsed[key] = false;
      else parsed[key] = val;
    });
    return parsed as TFilters;
  }, [searchParams, defaultFilters]);

  // Updates searchParams while preserving other params
  const updateParams = useCallback(
    (updater: (prev: URLSearchParams) => URLSearchParams) => {
      setSearchParams(
        (prev) => {
          const next = updater(new URLSearchParams(prev));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateParams((prev) => {
        if (newPage <= 1) {
          prev.delete("page");
        } else {
          prev.set("page", String(newPage));
        }
        return prev;
      });
    },
    [updateParams],
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      updateParams((prev) => {
        prev.set("limit", String(newLimit));
        prev.delete("page"); // reset to page 1
        return prev;
      });
    },
    [updateParams],
  );

  const setSort = useCallback(
    (newSort: string) => {
      updateParams((prev) => {
        if (newSort === defaultSort) {
          prev.delete("sort");
        } else {
          prev.set("sort", newSort);
        }
        prev.delete("page");
        return prev;
      });
    },
    [updateParams, defaultSort],
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      updateParams((prev) => {
        const trimmed = newSearch.trim();
        if (trimmed) {
          prev.set("search", trimmed);
        } else {
          prev.delete("search");
        }
        prev.delete("page");
        return prev;
      });
    },
    [updateParams],
  );

  const setFilter = useCallback(
    (key: string, value: unknown) => {
      updateParams((prev) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all"
        ) {
          prev.delete(key);
        } else {
          prev.set(key, String(value));
        }
        prev.delete("page");
        return prev;
      });
    },
    [updateParams],
  );

  const setFilters = useCallback(
    (newFilters: Record<string, unknown>) => {
      updateParams((prev) => {
        Object.entries(newFilters).forEach(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            value === "all"
          ) {
            prev.delete(key);
          } else {
            prev.set(key, String(value));
          }
        });
        prev.delete("page");
        return prev;
      });
    },
    [updateParams],
  );

  const resetFilters = useCallback(() => {
    updateParams((prev) => {
      const keysToDelete: string[] = [];
      prev.forEach((_, key) => {
        keysToDelete.push(key);
      });
      keysToDelete.forEach((key) => prev.delete(key));
      return prev;
    });
  }, [updateParams]);

  return {
    page,
    limit,
    offset,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    setFilters,
    resetFilters,
  };
}
