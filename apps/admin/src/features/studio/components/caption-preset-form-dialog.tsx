import { useState } from "react";
import { Captions, Loader2 } from "lucide-react";
import {
  CAPTION_CONFIG_SCHEMA_VERSION,
  normalizeTemplate,
  type CaptionTemplate,
} from "@perpix/caption-renderer";
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
import { CaptionTemplateEditor } from "./caption-template-editor";
import { useCaptionPresetActions } from "../hooks/use-caption-preset-actions";
import {
  MAX_PRESET_NAME_LENGTH,
  MAX_SORT_ORDER,
  parseConfigText,
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
  const [isActive, setIsActive] = useState(initialPreset?.is_active ?? true);
  const [look, setLook] = useState<CaptionTemplate>(() =>
    normalizeTemplate(initialPreset?.config),
  );

  const { createPreset, updatePreset, isSaving } = useCaptionPresetActions();

  // The stored config is the complete, normalised look, so a later version of
  // the renderer never has to guess what a missing key meant.
  const config = parseConfigText(JSON.stringify(look));
  const parsedSortOrder = parseSortOrder(sortOrder);
  const trimmedName = name.trim();
  const canSave =
    config.ok &&
    parsedSortOrder !== null &&
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_PRESET_NAME_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || !config.ok) return;
    const body = {
      name: trimmedName,
      config: config.value,
      schema_version: CAPTION_CONFIG_SCHEMA_VERSION,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
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
        <p className="text-xs text-muted-foreground">
          {t("features.studio.captionPresets.form.nameHint", {
            defaultValue: "این نام به کاربر نشان داده می‌شود.",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
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
          <p className="text-xs text-muted-foreground">
            {t("features.studio.captionPresets.form.sortOrderHint", {
              defaultValue: "عدد کمتر زودتر نمایش داده می‌شود.",
            })}
          </p>
        </div>
      </div>

      <CaptionTemplateEditor template={look} onChange={setLook} />

      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="size-4 rounded text-primary focus:ring-primary"
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
      <DialogPopup className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Captions className="size-5 text-primary" />
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
