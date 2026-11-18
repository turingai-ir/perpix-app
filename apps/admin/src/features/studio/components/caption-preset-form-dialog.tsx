import { useState } from "react";
import { Captions, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppTranslate } from "@/hooks";
import { useCaptionPresetActions } from "../hooks/use-caption-preset-actions";
import {
  MAX_PRESET_CONFIG_BYTES,
  MAX_PRESET_NAME_LENGTH,
  MAX_SORT_ORDER,
  formatConfig,
  parseConfigText,
  parseSchemaVersion,
  parseSortOrder,
  type CaptionPreset,
} from "../model/caption-preset";

interface CaptionPresetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPreset?: CaptionPreset | null;
  /** The sort order a new preset starts with: after the last one. */
  nextSortOrder?: number;
}

const kb = (bytes: number) => (bytes / 1024).toFixed(1);

function CaptionPresetFormContent({
  initialPreset,
  nextSortOrder,
  onClose,
}: {
  initialPreset?: CaptionPreset | null;
  nextSortOrder: number;
  onClose: () => void;
}) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPreset);

  const [name, setName] = useState(initialPreset?.name ?? "");
  const [sortOrder, setSortOrder] = useState(
    String(initialPreset?.sort_order ?? nextSortOrder),
  );
  const [schemaVersion, setSchemaVersion] = useState(
    String(initialPreset?.schema_version ?? 1),
  );
  const [isActive, setIsActive] = useState(initialPreset?.is_active ?? true);
  const [configText, setConfigText] = useState(
    initialPreset ? formatConfig(initialPreset.config) : "{}",
  );

  const { createPreset, updatePreset, isSaving } = useCaptionPresetActions();

  const config = parseConfigText(configText);
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSchemaVersion = parseSchemaVersion(schemaVersion);
  const trimmedName = name.trim();
  const canSave =
    config.ok &&
    parsedSortOrder !== null &&
    parsedSchemaVersion !== null &&
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_PRESET_NAME_LENGTH;

  const configError = config.ok
    ? null
    : config.reason === "invalid_json"
      ? t("features.studio.captionPresets.form.configInvalid", {
          defaultValue: "JSON معتبر نیست.",
        })
      : config.reason === "not_object"
        ? t("features.studio.captionPresets.form.configNotObject", {
            defaultValue:
              "تنظیمات باید یک شیء JSON باشد، نه آرایه یا مقدار ساده.",
          })
        : t("features.studio.captionPresets.form.configTooLarge", {
            defaultValue: "حجم تنظیمات از حد مجاز بیشتر است.",
          });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || !config.ok) return;
    const body = {
      name: trimmedName,
      config: config.value,
      schema_version: parsedSchemaVersion,
      is_active: isActive,
      sort_order: parsedSortOrder,
    };
    try {
      if (isEdit && initialPreset) {
        await updatePreset({ presetUuid: initialPreset.uuid, body });
      } else {
        await createPreset(body);
      }
      onClose();
    } catch {
      // toast is handled in the hook
    }
  };

  const handleFormat = () => {
    if (config.ok) setConfigText(formatConfig(config.value));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.studio.captionPresets.form.name", {
            defaultValue: "نام قالب",
          })}{" "}
          <span className="text-destructive">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_PRESET_NAME_LENGTH}
          placeholder="کارائوکه زرد"
          required
        />
        <p className="text-muted-foreground text-xs">
          {t("features.studio.captionPresets.form.nameHint", {
            defaultValue: "این نام به کاربر نشان داده می‌شود.",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.studio.captionPresets.form.sortOrder", {
              defaultValue: "ترتیب نمایش",
            })}
          </label>
          <Input
            type="number"
            min={0}
            max={MAX_SORT_ORDER}
            step={1}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            dir="ltr"
          />
          <p className="text-muted-foreground text-xs">
            {t("features.studio.captionPresets.form.sortOrderHint", {
              defaultValue: "عدد کمتر زودتر نمایش داده می‌شود.",
            })}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.studio.captionPresets.form.schemaVersion", {
              defaultValue: "نسخهٔ قالب تنظیمات",
            })}
          </label>
          <Input
            type="number"
            min={1}
            step={1}
            value={schemaVersion}
            onChange={(e) => setSchemaVersion(e.target.value)}
            dir="ltr"
          />
          <p className="text-muted-foreground text-xs">
            {t("features.studio.captionPresets.form.schemaVersionHint", {
              defaultValue:
                "نسخهٔ قالب JSON که فرانت می‌فهمد؛ با تغییر ساختار بالا می‌رود.",
            })}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-foreground text-xs font-semibold">
            {t("features.studio.captionPresets.form.config", {
              defaultValue: "تنظیمات ظاهر (JSON)",
            })}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!config.ok}
            onClick={handleFormat}
            className="h-7 cursor-pointer px-2 text-xs"
          >
            {t("features.studio.captionPresets.form.format", {
              defaultValue: "مرتب‌سازی JSON",
            })}
          </Button>
        </div>
        <textarea
          className="border-border bg-background text-foreground focus:ring-ring w-full rounded border px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-offset-2 focus:outline-none"
          rows={14}
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          spellCheck={false}
          dir="ltr"
          aria-invalid={!config.ok}
        />
        <div className="flex items-center justify-between text-xs">
          <span
            className={
              configError ? "text-destructive" : "text-muted-foreground"
            }
          >
            {configError ??
              t("features.studio.captionPresets.form.configHint", {
                defaultValue:
                  "بک‌اند این ساختار را تفسیر نمی‌کند؛ فقط نگه می‌دارد.",
              })}
          </span>
          <span className="text-muted-foreground" dir="ltr">
            {kb(config.bytes)} / {kb(MAX_PRESET_CONFIG_BYTES)} KB
          </span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="text-primary focus:ring-primary size-4 rounded"
        />
        <span>
          {t("features.studio.captionPresets.form.isActive", {
            defaultValue: "برای کاربران نمایش داده شود",
          })}
        </span>
      </label>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
          className="cursor-pointer"
        >
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button
          type="submit"
          disabled={isSaving || !canSave}
          className="cursor-pointer gap-2"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          {isEdit
            ? t("common.save", { defaultValue: "ذخیره تغییرات" })
            : t("features.studio.captionPresets.form.createSubmit", {
                defaultValue: "ساخت قالب",
              })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CaptionPresetFormDialog({
  open,
  onOpenChange,
  initialPreset,
  nextSortOrder = 0,
}: CaptionPresetFormDialogProps) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPreset);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Captions className="text-primary size-5" />
            <DialogTitle>
              {isEdit
                ? t("features.studio.captionPresets.form.editTitle", {
                    defaultValue: "ویرایش قالب کپشن",
                  })
                : t("features.studio.captionPresets.form.createTitle", {
                    defaultValue: "قالب کپشن جدید",
                  })}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t("features.studio.captionPresets.form.description", {
              defaultValue:
                "قالب‌های ادمین به همهٔ کاربران استودیو پیشنهاد می‌شوند و کاربر می‌تواند از آن‌ها کپی بگیرد.",
            })}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <CaptionPresetFormContent
            key={initialPreset ? initialPreset.uuid : "create"}
            initialPreset={initialPreset}
            nextSortOrder={nextSortOrder}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogPopup>
    </Dialog>
  );
}
