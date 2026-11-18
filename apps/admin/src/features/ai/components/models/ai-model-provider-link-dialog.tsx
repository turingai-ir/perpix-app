import { useState } from "react";
import { Link2, Settings2 } from "lucide-react";
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
import { useAppTranslate } from "@/hooks";
import { useAiModelActions } from "../../hooks/use-ai-model-actions";
import { servedModes } from "../../model/link-modes";
import { parseJsonObject, stringifyJsonObject } from "../../model/json-object";
import { JsonObjectField } from "../json-object-field";
import type {
  AiRegistryModelProviderLinkDetail,
  ProvidersRow,
} from "../../model/types";

interface AiModelProviderLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelUuid: string;
  modelName: string;
  /** Link being edited; `null` opens the dialog in "add provider" mode. */
  link: AiRegistryModelProviderLinkDetail | null;
  /** Providers that can still be linked (add mode only). */
  availableProviders: readonly ProvidersRow[];
  /** Current provider order (highest priority first); a new link is appended. */
  orderedProviderUuids: readonly string[];
  onSuccess?: () => void;
}

const parseModes = (value: string) =>
  value
    .split(",")
    .map((mode) => mode.trim())
    .filter(Boolean);

/**
 * Add a provider to a model, or edit an existing link. Priority is managed by
 * ordering the list in the panel, not by typing a number here. Mount with a
 * `key` per target so the form state resets between uses.
 */
export function AiModelProviderLinkDialog({
  open,
  onOpenChange,
  modelUuid,
  modelName,
  link,
  availableProviders,
  orderedProviderUuids,
  onSuccess,
}: AiModelProviderLinkDialogProps) {
  const { t } = useAppTranslate();
  const { addProvider, updateProviderLink, reorderProviders } =
    useAiModelActions();
  const isEditing = link !== null;

  const [providerUuid, setProviderUuid] = useState("");
  const [isActive, setIsActive] = useState(link?.is_active ?? true);
  const [workflowModes, setWorkflowModes] = useState(
    (link?.workflow_modes ?? []).join(", "),
  );
  const initialModesText = stringifyJsonObject(link?.modes);
  const [modesText, setModesText] = useState(initialModesText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modesConfig = parseJsonObject(modesText);
  // Checkboxes follow the config being edited, so a mode added below can be switched on at once.
  const editedServedModes = modesConfig.ok
    ? servedModes({ modes: modesConfig.value })
    : [];

  const canSubmit = (isEditing || providerUuid !== "") && modesConfig.ok;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting || !modesConfig.ok) return;

    setIsSubmitting(true);
    try {
      const modes = parseModes(workflowModes);
      if (isEditing) {
        if (!link.provider_uuid) return;
        await updateProviderLink(modelUuid, link.provider_uuid, {
          is_active: isActive,
          workflow_modes: modes,
          // Unchanged text is not resent: the stored config can be large.
          ...(modesText !== initialModesText
            ? { modes: modesConfig.value }
            : {}),
        });
      } else {
        await addProvider(modelUuid, {
          ai_provider_uuid: providerUuid,
          is_active: isActive,
          workflow_modes: modes,
          modes: modesConfig.value,
          priority: 10,
        });
        // New providers go to the end of the list (lowest priority).
        await reorderProviders(
          modelUuid,
          [...orderedProviderUuids, providerUuid],
          { silent: true },
        );
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // toast handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = isEditing ? Settings2 : Link2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="text-primary size-5" />
            {isEditing
              ? t("features.ai.models.editProviderTitle", {
                  defaultValue: "ویرایش اتصال ارائه‌دهنده",
                })
              : t("features.ai.models.linkProviderTitle", {
                  defaultValue: "افزودن ارائه‌دهنده به مدل",
                })}
          </DialogTitle>
          <DialogDescription>
            مدل{" "}
            <strong className="text-foreground font-mono">{modelName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
          {!isEditing && (
            <div>
              <label className="text-foreground mb-1 block text-xs font-semibold">
                {t("features.ai.models.selectProvider", {
                  defaultValue: "ارائه‌دهنده (AI Provider)",
                })}{" "}
                *
              </label>
              {availableProviders.length === 0 ? (
                <p className="text-muted-foreground text-xs">
                  همهٔ ارائه‌دهندگان موجود قبلاً به این مدل متصل شده‌اند.
                </p>
              ) : (
                <Select
                  value={providerUuid}
                  onChange={(e) => setProviderUuid(e.target.value)}
                  required
                >
                  <option value="">انتخاب کنید...</option>
                  {availableProviders.map((p) => (
                    <option key={p.uuid} value={p.uuid}>
                      {p.display_name
                        ? `${p.display_name} (${p.name})`
                        : p.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          )}

          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {t("features.ai.models.workflowModes", {
                defaultValue: "حالت‌های Workflow",
              })}
            </label>
            {editedServedModes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {editedServedModes.map((mode) => {
                  const on = parseModes(workflowModes).includes(mode);
                  return (
                    <label
                      key={mode}
                      dir="ltr"
                      className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setWorkflowModes(
                            (on
                              ? parseModes(workflowModes).filter(
                                  (m) => m !== mode,
                                )
                              : [...parseModes(workflowModes), mode]
                            ).join(", "),
                          )
                        }
                      />
                      {mode}
                    </label>
                  );
                })}
              </div>
            ) : (
              <Input
                dir="ltr"
                value={workflowModes}
                onChange={(e) => setWorkflowModes(e.target.value)}
                placeholder="text_to_image, image_to_image"
              />
            )}
            <span className="text-muted-foreground mt-1 block text-[11px]">
              فقط حالت‌های روشن درخواست می‌گیرند. خالی یعنی همهٔ حالت‌ها
              خاموش‌اند و هر درخواست برای این اتصال رد می‌شود.
            </span>
          </div>

          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-xs font-semibold">
              تنظیمات هر حالت (modes)
            </summary>
            <div className="pt-3">
              <JsonObjectField
                id="link-modes"
                label="modes (JSON)"
                hint="schema، نگاشت فیلدها، قرارداد خروجی و قیمت هر حالت. مقدار حالت‌های روشن را با دقت عوض کنید."
                value={modesText}
                onChange={setModesText}
                rows={16}
              />
            </div>
          </details>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="link-active-toggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="text-primary focus:ring-primary size-4 rounded border-gray-300"
            />
            <label
              htmlFor="link-active-toggle"
              className="cursor-pointer text-xs font-medium"
            >
              اتصال فعال باشد (ارسال درخواست به این ارائه‌دهنده مجاز باشد)
            </label>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel", { defaultValue: "انصراف" })}
            </Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting
                ? t("common.submitting", { defaultValue: "در حال ذخیره..." })
                : isEditing
                  ? t("common.save", { defaultValue: "ذخیره" })
                  : t("features.ai.models.linkConfirm", {
                      defaultValue: "افزودن ارائه‌دهنده",
                    })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
