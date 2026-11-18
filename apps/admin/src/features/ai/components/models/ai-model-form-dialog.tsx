import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAiModelActions } from "../../hooks/use-ai-model-actions";
import { useAiModelDetail } from "../../hooks/use-ai-model-detail";
import { parseJsonObject, stringifyJsonObject } from "../../model/json-object";
import { JsonObjectField } from "../json-object-field";
import { useAppTranslate } from "@/hooks";
import { aiRegistryModelOwnerEnumValues } from "@/services/api/api";
import type {
  AiRegistryModelDetail,
  AiRegistryModelOwnerEnum,
  AiRegistryModelSupportedTypesEnum,
} from "../../model/types";

interface AiModelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Only its uuid is used: the form loads the full record itself. */
  initialModel?: { readonly uuid: string } | null;
  onSuccess?: () => void;
}

const MODEL_OWNERS = aiRegistryModelOwnerEnumValues;

const SUPPORTED_TYPES: AiRegistryModelSupportedTypesEnum[] = [
  "TEXT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
];

function AiModelFormContent({
  initialModel,
  onClose,
  onSuccess,
}: {
  initialModel?: AiRegistryModelDetail | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const { createModel, updateModel, isCreatingModel, isUpdatingModel } =
    useAiModelActions();

  const isEditing = Boolean(initialModel);
  const isSubmitting = isCreatingModel || isUpdatingModel;

  const [name, setName] = useState(initialModel?.name ?? "");
  const [displayName, setDisplayName] = useState(
    initialModel?.display_name ?? "",
  );
  const [description, setDescription] = useState(
    initialModel?.description ?? "",
  );
  const [modelOwner, setModelOwner] = useState<AiRegistryModelOwnerEnum>(
    initialModel?.model_owner ?? "OPEN_AI",
  );
  const [iconUrl, setIconUrl] = useState(initialModel?.icon_url ?? "");
  const [selectedInputs, setSelectedInputs] = useState<
    AiRegistryModelSupportedTypesEnum[]
  >(
    initialModel?.supported_inputs
      ? Array.from(initialModel.supported_inputs)
      : ["TEXT"],
  );
  const [selectedOutputs, setSelectedOutputs] = useState<
    AiRegistryModelSupportedTypesEnum[]
  >(
    initialModel?.supported_outputs
      ? Array.from(initialModel.supported_outputs)
      : ["TEXT"],
  );
  const [tagsStr, setTagsStr] = useState(
    initialModel?.tags ? Array.from(initialModel.tags).join(", ") : "",
  );
  const [isActive, setIsActive] = useState(initialModel?.is_active ?? true);
  const [modesText, setModesText] = useState(
    stringifyJsonObject(initialModel?.modes_supported),
  );
  const [uiSchemaText, setUiSchemaText] = useState(
    stringifyJsonObject(initialModel?.canonical_ui_schema),
  );
  const [metaText, setMetaText] = useState(
    stringifyJsonObject(initialModel?.meta),
  );
  const modes = parseJsonObject(modesText);
  const uiSchema = parseJsonObject(uiSchemaText);
  const meta = parseJsonObject(metaText);
  const jsonValid = modes.ok && uiSchema.ok && meta.ok;

  const toggleInputType = (type: AiRegistryModelSupportedTypesEnum) => {
    setSelectedInputs((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleOutputType = (type: AiRegistryModelSupportedTypesEnum) => {
    setSelectedOutputs((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !modes.ok || !uiSchema.ok || !meta.ok) return;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    // The server validates each mode's shape ({ "value": "..." }) and refuses a bad one.
    const modesSupported = modes.value as Record<string, { value: string }>;

    try {
      if (isEditing && initialModel) {
        // Edit sends every field, so a cleared one is cleared (null / []), not left as it was.
        await updateModel(initialModel.uuid, {
          name: name.trim(),
          display_name: displayName.trim() || null,
          description: description.trim() || null,
          model_owner: modelOwner,
          icon_url: iconUrl.trim() || null,
          modes_supported: modesSupported,
          canonical_ui_schema: uiSchema.value,
          supported_inputs: selectedInputs,
          supported_outputs: selectedOutputs,
          tags,
          is_active: isActive,
          meta: meta.value,
        });
      } else {
        await createModel({
          name: name.trim(),
          display_name: displayName.trim() || undefined,
          description: description.trim() || undefined,
          model_owner: modelOwner,
          icon_url: iconUrl.trim() || undefined,
          modes_supported: modesSupported,
          canonical_ui_schema: uiSchema.value,
          supported_inputs: selectedInputs,
          supported_outputs: selectedOutputs,
          tags: tags.length ? tags : undefined,
          is_active: isActive,
          meta: meta.value,
        });
      }
      onClose();
      onSuccess?.();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.name", {
              defaultValue: "نام شناسه (کد مدل)",
            })}{" "}
            *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="gpt-4o"
            required
            dir="ltr"
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.displayName", {
              defaultValue: "نام نمایشی",
            })}
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="GPT-4o (Omni)"
          />
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.models.description", {
            defaultValue: "توضیحات مدل",
          })}
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="مدل هوشمند چندحالته پرسرعت..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.modelOwner", {
              defaultValue: "شرکت صاحب امتیاز",
            })}
          </label>
          <Select
            value={modelOwner}
            onChange={(e) =>
              setModelOwner(e.target.value as AiRegistryModelOwnerEnum)
            }
          >
            {MODEL_OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.models.iconUrl", {
              defaultValue: "آدرس آیکون (URL)",
            })}
          </label>
          <Input
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://..."
            dir="ltr"
          />
        </div>
      </div>

      {/* Supported Inputs */}
      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
          {t("features.ai.models.supportedInputs", {
            defaultValue: "ورودی‌های پشتیبانی‌شده",
          })}
        </label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_TYPES.map((type) => {
            const isSelected = selectedInputs.includes(type);
            return (
              <Button
                key={type}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => toggleInputType(type)}
              >
                {type}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Supported Outputs */}
      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
          {t("features.ai.models.supportedOutputs", {
            defaultValue: "خروجی‌های پشتیبانی‌شده",
          })}
        </label>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_TYPES.map((type) => {
            const isSelected = selectedOutputs.includes(type);
            return (
              <Button
                key={type}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => toggleOutputType(type)}
              >
                {type}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.models.tags", {
            defaultValue: "برچسب‌ها (با کاما جدا کنید)",
          })}
        </label>
        <Input
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="fast, vision, reasoning"
          dir="ltr"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="model-active-toggle"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="text-primary focus:ring-primary size-4 rounded border-gray-300"
        />
        <label
          htmlFor="model-active-toggle"
          className="cursor-pointer text-xs font-medium"
        >
          {t("features.ai.models.isActive", {
            defaultValue: "مدل فعال و آماده سرویس‌دهی باشد",
          })}
        </label>
      </div>

      <details className="rounded-lg border p-3">
        <summary className="cursor-pointer text-xs font-semibold">
          تنظیمات پیشرفته (حالت‌ها، UI، meta)
        </summary>
        <div className="space-y-4 pt-3">
          {isEditing && initialModel && (
            <p className="text-muted-foreground text-[11px]" dir="ltr">
              cost range: {initialModel.min_cost ?? "-"} –{" "}
              {initialModel.max_cost ?? "-"} (read-only, from provider links)
            </p>
          )}
          <JsonObjectField
            id="model-modes"
            label="modes_supported (JSON)"
            hint='هر حالت: { "text_to_image": { "value": "..." } }'
            value={modesText}
            onChange={setModesText}
            rows={6}
          />
          <JsonObjectField
            id="model-ui-schema"
            label="canonical_ui_schema (JSON)"
            hint="ساختار فرم ساخت در اپ کاربر؛ ساختار عنصرها را نشکنید."
            value={uiSchemaText}
            onChange={setUiSchemaText}
            rows={12}
          />
          <JsonObjectField
            id="model-meta"
            label="meta (JSON)"
            value={metaText}
            onChange={setMetaText}
            rows={5}
          />
        </div>
      </details>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button type="submit" disabled={isSubmitting || !jsonValid}>
          {isSubmitting
            ? t("common.submitting", { defaultValue: "در حال ثبت..." })
            : isEditing
              ? t("common.update", { defaultValue: "بروزرسانی مدل" })
              : t("common.create", { defaultValue: "ایجاد مدل" })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AiModelFormDialog({
  open,
  onOpenChange,
  initialModel,
  onSuccess,
}: AiModelFormDialogProps) {
  const { t } = useAppTranslate();
  const isEditing = Boolean(initialModel);
  // Edit from the full record, never from a list row (it lacks modes, UI schema and meta).
  const { model, error } = useAiModelDetail(
    open && initialModel ? initialModel.uuid : "",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("features.ai.models.editTitle", {
                  defaultValue: "ویرایش مدل هوش مصنوعی",
                })
              : t("features.ai.models.createTitle", {
                  defaultValue: "ایجاد مدل هوش مصنوعی جدید",
                })}
          </DialogTitle>
          <DialogDescription>
            {t("features.ai.models.formDesc", {
              defaultValue:
                "مشخصات مدل، ورودی/خروجی‌های پشتیبانی‌شده و مالک مدل را تعیین کنید.",
            })}
          </DialogDescription>
        </DialogHeader>

        {open && !isEditing && (
          <AiModelFormContent
            key="create"
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
        {open && isEditing && model && (
          <AiModelFormContent
            key={`${model.uuid}:${model.updated_at}`}
            // The query type mangles nested readonly arrays; the shape is the schema's.
            initialModel={model as unknown as AiRegistryModelDetail}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
        {open && isEditing && !model && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {error
              ? t("features.ai.models.loadError", {
                  defaultValue:
                    "بارگذاری اطلاعات مدل ناموفق بود. پنجره را ببندید و دوباره باز کنید.",
                })
              : t("common.loading", { defaultValue: "در حال بارگذاری..." })}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
