import { useMemo, useState } from "react";
import {
  Captions,
  Check,
  Edit,
  PlusCircle,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCaptionPresets } from "../hooks/use-caption-presets";
import { useCaptionPresetActions } from "../hooks/use-caption-preset-actions";
import { CaptionPresetFormDialog } from "./caption-preset-form-dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAppTranslate } from "@/hooks";
import type { CaptionPreset } from "../model/caption-preset";

const faNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);

export function CaptionPresetsPage() {
  const { t } = useAppTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CaptionPreset | null>(null);
  const [deleting, setDeleting] = useState<CaptionPreset | null>(null);

  const { data, isPending, isError, refetch } = useCaptionPresets();
  const { updatePreset, deletePreset, isSaving, isDeleting } =
    useCaptionPresetActions();

  const items = useMemo<CaptionPreset[]>(
    () => Array.from(data?.items ?? []),
    [data],
  );
  const nextSortOrder = useMemo(
    () => items.reduce((last, item) => Math.max(last, item.sort_order), -1) + 1,
    [items],
  );

  const handleToggleActive = async (preset: CaptionPreset) => {
    try {
      await updatePreset({
        presetUuid: preset.uuid,
        body: {
          name: preset.name,
          config: preset.config,
          schema_version: preset.schema_version,
          sort_order: preset.sort_order,
          is_active: !preset.is_active,
        },
      });
    } catch {
      // toast is handled in the hook
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deletePreset(deleting.uuid);
      setDeleting(null);
    } catch {
      // toast is handled in the hook
    }
  };

  const columns: DataTableColumn<CaptionPreset>[] = [
    {
      id: "sort_order",
      header: t("features.studio.captionPresets.columns.sortOrder", {
        defaultValue: "ترتیب",
      }),
      cell: (item) => (
        <span className="font-mono text-xs">{faNumber(item.sort_order)}</span>
      ),
    },
    {
      id: "name",
      header: t("features.studio.captionPresets.columns.name", {
        defaultValue: "نام قالب",
      }),
      cell: (item) => (
        <span className="text-foreground text-sm font-bold">{item.name}</span>
      ),
    },
    {
      id: "schema_version",
      header: t("features.studio.captionPresets.columns.schemaVersion", {
        defaultValue: "نسخهٔ تنظیمات",
      }),
      cell: (item) => (
        <span className="font-mono text-xs">v{item.schema_version}</span>
      ),
    },
    {
      id: "status",
      header: t("features.studio.captionPresets.columns.status", {
        defaultValue: "وضعیت",
      }),
      cell: (item) =>
        item.is_active ? (
          <Badge variant="success">
            {t("features.studio.captionPresets.visible", {
              defaultValue: "نمایش داده می‌شود",
            })}
          </Badge>
        ) : (
          <Badge variant="muted">
            {t("features.studio.captionPresets.hidden", {
              defaultValue: "مخفی",
            })}
          </Badge>
        ),
    },
    {
      id: "actions",
      header: t("common.actions", { defaultValue: "عملیات" }),
      className: "text-center",
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditing(item);
              setIsDialogOpen(true);
            }}
            className="h-8 cursor-pointer gap-1.5 px-2.5 text-xs"
          >
            <Edit className="size-3.5" />
            {t("common.edit", { defaultValue: "ویرایش" })}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={() => void handleToggleActive(item)}
            className="text-muted-foreground hover:text-foreground h-8 cursor-pointer gap-1.5 px-2.5 text-xs"
          >
            {item.is_active ? (
              <>
                <XCircle className="text-destructive size-3.5" />
                مخفی کردن
              </>
            ) : (
              <>
                <Check className="size-3.5 text-emerald-600" />
                نمایش
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleting(item)}
            aria-label="حذف قالب"
            className="text-destructive h-8 cursor-pointer px-2.5"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <Captions aria-hidden="true" className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.studio.menuSection", { defaultValue: "استودیو" })}
          </span>
          <span>/</span>
          <span>
            {t("features.studio.captionPresets.menuTitle", {
              defaultValue: "قالب‌های کپشن",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("features.studio.captionPresets.title", {
                defaultValue: "قالب‌های کپشن استودیو",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("features.studio.captionPresets.description", {
                defaultValue:
                  "قالب‌هایی که به همهٔ کاربران استودیو پیشنهاد می‌شوند. کاربر از آن‌ها کپی می‌گیرد و تغییر یا حذف قالب ادمین روی کپی‌های او اثری ندارد.",
              })}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setIsDialogOpen(true);
            }}
            className="cursor-pointer gap-2 shadow-xs"
          >
            <PlusCircle className="size-4" />
            {t("features.studio.captionPresets.createNew", {
              defaultValue: "افزودن قالب جدید",
            })}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isPending}
        isError={isError}
        errorMessage={t("features.studio.captionPresets.loadError", {
          defaultValue: "بارگذاری قالب‌های کپشن با خطا مواجه شد.",
        })}
        emptyMessage={t("features.studio.captionPresets.empty", {
          defaultValue: "هنوز قالبی ساخته نشده است.",
        })}
        onRetry={() => void refetch()}
        keyExtractor={(item) => item.uuid}
      />

      <CaptionPresetFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialPreset={editing}
        nextSortOrder={nextSortOrder}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={t("features.studio.captionPresets.deleteTitle", {
          defaultValue: "حذف قالب کپشن",
        })}
        description={t("features.studio.captionPresets.deleteDescription", {
          defaultValue:
            "قالب برای همه حذف می‌شود، ولی کپی‌هایی که کاربران ذخیره کرده‌اند می‌مانند.",
        })}
        confirmText={t("common.delete", { defaultValue: "حذف" })}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
