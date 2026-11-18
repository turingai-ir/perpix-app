import { useCallback, useMemo, useState } from "react";
import {
  Server,
  PlusCircle,
  Edit,
  RotateCcw,
  XCircle,
  Key,
  Power,
} from "lucide-react";
import {
  useAiProvidersList,
  type AiProvidersRowItem,
} from "../../hooks/use-ai-providers-list";
import { AiProviderFormDialog } from "./ai-provider-form-dialog";
import { useAiProviderActions } from "../../hooks/use-ai-provider-actions";
import { providerAvailability } from "../../model/provider-availability";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import type { AdminSort } from "../../model/types";

export function AiProvidersListPage() {
  const { t } = useAppTranslate();

  const [editingProvider, setEditingProvider] =
    useState<AiProvidersRowItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    page,
    limit,
    sort,
    search,
    setPage,
    setLimit,
    setSort,
    setSearch,
    resetFilters,
  } = useTableQuery({
    defaultLimit: 10,
    defaultSort: "-created_at",
  });

  const { providers, totalCount, isLoading, error, refetch } =
    useAiProvidersList({
      page,
      limit,
      sort: (sort as AdminSort) || "-created_at",
      search,
    });

  const handleCreateClick = () => {
    setEditingProvider(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (provider: AiProvidersRowItem) => {
    setEditingProvider(provider);
    setIsDialogOpen(true);
  };

  const { reenableProvider, isReenablingProvider } = useAiProviderActions();
  const handleReenableClick = useCallback(
    async (provider: AiProvidersRowItem) => {
      try {
        await reenableProvider(provider.uuid);
        void refetch();
      } catch {
        // toast handled in hook
      }
    },
    [reenableProvider, refetch],
  );

  const columns: DataTableColumn<AiProvidersRowItem>[] = useMemo(
    () => [
      {
        id: "name",
        header: t("features.ai.providers.columns.name", {
          defaultValue: "نام ارائه‌دهنده",
        }),
        cell: (item) => (
          <div className="space-y-0.5">
            <span className="text-foreground block text-xs font-bold">
              {item.display_name || item.name}
            </span>
            <code className="text-muted-foreground font-mono text-[11px]">
              {item.name}
            </code>
          </div>
        ),
      },
      {
        id: "has_api_key",
        header: t("features.ai.providers.columns.hasKey", {
          defaultValue: "وضعیت کلید API",
        }),
        cell: (item) =>
          item.has_api_key ? (
            <Badge
              variant="default"
              className="gap-1 bg-emerald-600 text-white"
            >
              <Key className="size-3" />
              تنظیم شده
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-muted-foreground gap-1">
              <XCircle className="size-3" />
              تنظیم نشده
            </Badge>
          ),
      },
      {
        id: "unavailable_reason",
        header: t("features.ai.providers.columns.availability", {
          defaultValue: "وضعیت مسیردهی",
        }),
        cell: (item) => {
          const view = providerAvailability(item.unavailable_reason);
          return (
            <Badge variant={view.variant} title={view.hint}>
              {view.label}
            </Badge>
          );
        },
      },
      {
        id: "created_at",
        header: t("features.ai.providers.columns.createdAt", {
          defaultValue: "تاریخ ثبت",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            {item.unavailable_reason && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={isReenablingProvider}
                title={t("features.ai.providers.reenableHint", {
                  defaultValue:
                    "معمولاً لازم نیست: با اولین درخواست موفق خودکار فعال می‌شود.",
                })}
                onClick={() => void handleReenableClick(item)}
              >
                <Power className="size-3.5" />
                {t("features.ai.providers.reenable", {
                  defaultValue: "فعال‌سازی دستی",
                })}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => handleEditClick(item)}
            >
              <Edit className="size-3.5" />
              {t("common.edit", { defaultValue: "ویرایش" })}
            </Button>
          </div>
        ),
      },
    ],
    [t, isReenablingProvider, handleReenableClick],
  );

  const hasActiveFilters = Boolean(search || sort !== "-created_at");

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Server aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.ai.menuTitle", { defaultValue: "هوش مصنوعی" })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.ai.providers.pageTitle", {
                defaultValue: "ارائه‌دهندگان هوش مصنوعی (AI Providers)",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.ai.providers.pageDesc", {
                defaultValue:
                  "مدیریت کلیدهای API و اتصال به سرویس‌دهنده‌های بالادست مثل OpenAI، Google و Runware",
              })}
            </p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="size-4" />
            {t("features.ai.providers.newProvider", {
              defaultValue: "افزودن ارائه‌دهنده",
            })}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search || ""}
            onChange={setSearch}
            placeholder={t("features.ai.providers.searchPlaceholder", {
              defaultValue: "جستجو در ارائه‌دهندگان...",
            })}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={sort || "-created_at"}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="-created_at">
              {t("common.sortNewest", { defaultValue: "جدیدترین" })}
            </option>
            <option value="created_at">
              {t("common.sortOldest", { defaultValue: "قدیمی‌ترین" })}
            </option>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="size-3.5" />
            {t("common.resetFilters", { defaultValue: "حذف فیلترها" })}
          </Button>
        )}
      </div>

      {/* Table */}
      <DataTable<AiProvidersRowItem>
        keyExtractor={(item) => item.uuid}
        data={providers ? Array.from(providers) : []}
        columns={columns}
        isLoading={isLoading}
        isError={Boolean(error)}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => void refetch()}
        pagination={{
          page,
          limit,
          totalCount,
          onPageChange: setPage,
          onLimitChange: setLimit,
        }}
        emptyMessage={t("features.ai.providers.empty", {
          defaultValue: "ارائه‌دهنده‌ای یافت نشد.",
        })}
      />

      {/* Dialog */}
      <AiProviderFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialProvider={editingProvider}
        onSuccess={() => void refetch()}
      />
    </div>
  );
}
