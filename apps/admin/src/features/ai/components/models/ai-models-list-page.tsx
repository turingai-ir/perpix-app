import { useCallback, useMemo, useState } from "react";
import { Link, generatePath } from "react-router";
import {
  Cpu,
  PlusCircle,
  Edit,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Link2,
  ListOrdered,
} from "lucide-react";
import {
  useAiModelsList,
  type AiModelsRowItem,
} from "../../hooks/use-ai-models-list";
import { useAiRegistryReports } from "../../hooks/use-ai-registry-reports";
import { useAiModelActions } from "../../hooks/use-ai-model-actions";
import { AiModelFormDialog } from "./ai-model-form-dialog";
import { AiModelsOrderDialog } from "./ai-models-order-dialog";
import { APP_ROUTES_KEY } from "@/router/routes";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { CopyableUuid } from "@/components/custom/copyable-uuid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import {
  USDMICRO_UNIT_LABEL,
  formatTokensFromUsdmicro,
  formatUsdmicro,
  tokenHint,
} from "@/utils/usdmicro";
import { aiRegistryModelOwnerEnumValues } from "@/services/api/api";
import type { AdminSort, AiRegistryModelOwnerEnum } from "../../model/types";

const modelDetailPath = (modelUuid: string) =>
  generatePath(APP_ROUTES_KEY.ai.modelDetail.path, { modelUuid });

export function AiModelsListPage() {
  const { t } = useAppTranslate();

  const [editingModel, setEditingModel] = useState<AiModelsRowItem | null>(
    null,
  );
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const {
    page,
    limit,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    resetFilters,
  } = useTableQuery({
    defaultLimit: 10,
    defaultSort: "-created_at",
  });

  const { models, totalCount, isLoading, error, refetch } = useAiModelsList({
    page,
    limit,
    sort: (sort as AdminSort) || "-created_at",
    search,
    modelOwner:
      (filters.model_owner as AiRegistryModelOwnerEnum | "ALL") || "ALL",
  });

  const { updateModel, isUpdatingModel } = useAiModelActions();
  const { statuses } = useAiRegistryReports();
  const countOf = (key: string) =>
    statuses.find((b) => b.key === key)?.count ?? 0;

  const handleCreateClick = () => {
    setEditingModel(null);
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (model: AiModelsRowItem) => {
    setEditingModel(model);
    setIsFormDialogOpen(true);
  };

  const handleToggleActive = useCallback(
    async (model: AiModelsRowItem) => {
      const currentActive =
        (model as unknown as { is_active?: boolean }).is_active ?? true;
      try {
        await updateModel(model.uuid, {
          is_active: !currentActive,
        });
        void refetch();
      } catch {
        // toast handled in hook
      }
    },
    [updateModel, refetch],
  );

  const columns: DataTableColumn<AiModelsRowItem>[] = useMemo(
    () => [
      {
        id: "name",
        header: t("features.ai.models.columns.name", {
          defaultValue: "نام و عنوان مدل",
        }),
        cell: (item) => (
          <div className="flex items-center gap-2.5">
            {item.icon_url && (
              <img
                src={item.icon_url}
                alt={item.name}
                className="size-7 rounded-md border object-cover"
              />
            )}
            <div className="space-y-0.5">
              <Link
                to={modelDetailPath(item.uuid)}
                className="text-foreground hover:text-primary block text-xs font-bold hover:underline"
              >
                {item.display_name || item.name}
              </Link>
              <code className="text-muted-foreground block font-mono text-[11px]">
                {item.name}
              </code>
              <CopyableUuid value={item.uuid} />
            </div>
          </div>
        ),
      },
      {
        id: "supported_types",
        header: t("features.ai.models.columns.types", {
          defaultValue: "ورودی / خروجی",
        }),
        cell: (item) => (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-1">
              <span className="text-muted-foreground text-[10px]">In:</span>
              {Array.from(item.supported_inputs || []).map((inp, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-1 py-0 text-[10px]"
                >
                  {inp}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-muted-foreground text-[10px]">Out:</span>
              {Array.from(item.supported_outputs || []).map((out, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="px-1 py-0 text-[10px]"
                >
                  {out}
                </Badge>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "cost_range",
        header: t("features.ai.models.columns.costRange", {
          defaultValue: "دامنه هزینه",
        }),
        cell: (item) =>
          item.min_cost != null && item.max_cost != null ? (
            <div
              className="flex flex-col gap-0.5 text-xs tabular-nums"
              title={`${tokenHint(item.min_cost)} تا ${formatTokensFromUsdmicro(item.max_cost)} توکن`}
            >
              <span>
                {formatUsdmicro(item.min_cost)} تا{" "}
                {formatUsdmicro(item.max_cost)}{" "}
                <span className="text-muted-foreground">
                  {USDMICRO_UNIT_LABEL}
                </span>
              </span>
              <span className="text-muted-foreground text-[11px]">
                ≈ {formatTokensFromUsdmicro(item.min_cost)} تا{" "}
                {formatTokensFromUsdmicro(item.max_cost)} توکن
              </span>
            </div>
          ) : (
            "-"
          ),
      },
      {
        id: "status",
        header: t("features.ai.models.columns.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) => {
          const isActive =
            (item as unknown as { is_active?: boolean }).is_active ?? true;
          return isActive ? (
            <Badge
              variant="default"
              className="gap-1 bg-emerald-600 text-white"
            >
              <CheckCircle2 className="size-3" />
              فعال
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="size-3" />
              غیرفعال
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: (item) => {
          const isActive =
            (item as unknown as { is_active?: boolean }).is_active ?? true;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                nativeButton={false}
                render={<Link to={modelDetailPath(item.uuid)} />}
              >
                <Link2 className="size-3.5" />
                ارائه‌دهندگان
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() => handleEditClick(item)}
              >
                <Edit className="size-3.5" />
                ویرایش
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={isUpdatingModel}
                onClick={() => void handleToggleActive(item)}
              >
                {isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
              </Button>
            </div>
          );
        },
      },
    ],
    [handleToggleActive, isUpdatingModel, t],
  );

  const hasActiveFilters = Boolean(
    search ||
    (filters.model_owner && filters.model_owner !== "ALL") ||
    sort !== "-created_at",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Cpu aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.ai.menuTitle", { defaultValue: "هوش مصنوعی" })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.ai.models.pageTitle", {
                defaultValue: "مدل‌های هوش مصنوعی (AI Models)",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.ai.models.pageDesc", {
                defaultValue:
                  "مدیریت رجیستری مدل‌های هوش مصنوعی، انواع ورودی/خروجی و اتصال به ارائه‌دهندگان",
              })}
            </p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              onClick={() => setIsOrderDialogOpen(true)}
              className="gap-2"
            >
              <ListOrdered className="size-4" />
              ترتیب نمایش
            </Button>
            <Button onClick={handleCreateClick} className="gap-2">
              <PlusCircle className="size-4" />
              {t("features.ai.models.newModel", {
                defaultValue: "مدل جدید",
              })}
            </Button>
          </div>
        </div>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="success">
          فعال: {countOf("active").toLocaleString("fa-IR")}
        </Badge>
        <Badge variant="muted">
          غیرفعال: {countOf("inactive").toLocaleString("fa-IR")}
        </Badge>
      </div>

      {/* Filters Bar */}
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search || ""}
            onChange={setSearch}
            placeholder={t("features.ai.models.searchPlaceholder", {
              defaultValue: "جستجو در مدل‌ها...",
            })}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={(filters.model_owner as string) || "ALL"}
            onChange={(e) =>
              setFilter(
                "model_owner",
                e.target.value === "ALL" ? "" : e.target.value,
              )
            }
          >
            <option value="ALL">همه مالکان (Owners)</option>
            {aiRegistryModelOwnerEnumValues.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </Select>
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
      <DataTable<AiModelsRowItem>
        keyExtractor={(item) => item.uuid}
        data={models ? Array.from(models) : []}
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
        emptyMessage={t("features.ai.models.empty", {
          defaultValue: "مدلی یافت نشد.",
        })}
      />

      <AiModelsOrderDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        onSaved={() => void refetch()}
      />

      {/* Model Form Dialog */}
      <AiModelFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        initialModel={editingModel}
        onSuccess={() => void refetch()}
      />
    </div>
  );
}
