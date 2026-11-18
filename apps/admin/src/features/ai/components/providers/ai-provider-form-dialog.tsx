import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
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
import { useAiProviderActions } from "../../hooks/use-ai-provider-actions";
import { useAiProviderDetail } from "../../hooks/use-ai-provider-detail";
import { parseJsonObject, stringifyJsonObject } from "../../model/json-object";
import { JsonObjectField } from "../json-object-field";
import { useAppTranslate } from "@/hooks";
import { tokenHint } from "@/utils/usdmicro";
import { Badge } from "@/components/ui/badge";
import { providerAvailability } from "../../model/provider-availability";
import type {
  AiRegistryProviderDetail,
  AiRegistryProviderKeyDetail,
  AiRegistryProviderKeyRequest,
  AiRegistryProviderNameEnum,
  AiRegistryProviderUnavailableReasonEnum,
  ProvidersRow,
} from "../../model/types";

interface AiProviderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProvider?: ProvidersRow | null;
  onSuccess?: () => void;
}

const PROVIDER_NAMES: AiRegistryProviderNameEnum[] = [
  "OPENAI",
  "GOOGLE",
  "OPENROUTER",
  "RUNWARE",
  "AIMLAPI",
  "KIE",
];

/** Only these take several keys; the others poll tasks with the creating key, so they keep one. */
const MULTI_KEY_PROVIDERS: readonly AiRegistryProviderNameEnum[] = ["GOOGLE"];
const MAX_PROVIDER_KEYS = 20;

/** A key row in the form. `id` is set for a stored key; a blank `apiKey` keeps its stored value. */
interface KeyDraft {
  rowId: string;
  id?: string;
  label: string;
  apiKey: string;
  unavailableReason?: AiRegistryProviderUnavailableReasonEnum | null;
}

let draftCounter = 0;
function newRowId(): string {
  draftCounter += 1;
  return `key-draft-${draftCounter}`;
}

function toKeyRequests(drafts: KeyDraft[]): AiRegistryProviderKeyRequest[] {
  const requests: AiRegistryProviderKeyRequest[] = [];
  for (const draft of drafts) {
    const label = draft.label.trim() || null;
    const value = draft.apiKey.trim();
    if (draft.id) {
      requests.push({
        id: draft.id,
        label,
        ...(value ? { api_key: value } : {}),
      });
    } else if (value) {
      // An empty new row is dropped: the API refuses a new key without a value.
      requests.push({ label, api_key: value });
    }
  }
  return requests;
}

/** The detail record; its key list is read as array-like because the query types it as a mapped array. */
type ProviderFormSource = Omit<AiRegistryProviderDetail, "api_keys"> & {
  readonly api_keys?: ArrayLike<AiRegistryProviderKeyDetail>;
};

function AiProviderFormContent({
  initialProvider,
  onClose,
  onSuccess,
}: {
  initialProvider?: ProviderFormSource | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const {
    createProvider,
    updateProvider,
    reenableProvider,
    isCreatingProvider,
    isUpdatingProvider,
    isReenablingProvider,
  } = useAiProviderActions();

  const isEditing = Boolean(initialProvider);
  const isSubmitting =
    isCreatingProvider || isUpdatingProvider || isReenablingProvider;
  const availability = providerAvailability(
    initialProvider?.unavailable_reason,
  );

  const [name, setName] = useState<AiRegistryProviderNameEnum>(() => {
    const pName = initialProvider?.name as AiRegistryProviderNameEnum;
    return PROVIDER_NAMES.includes(pName) ? pName : "OPENAI";
  });
  const [displayName, setDisplayName] = useState(
    initialProvider?.display_name || "",
  );
  const [baseApiUrl, setBaseApiUrl] = useState(
    initialProvider?.base_api_url ?? "",
  );
  const [keys, setKeys] = useState<KeyDraft[]>(() => {
    const stored = Array.from(initialProvider?.api_keys ?? []).map(
      (key): KeyDraft => ({
        rowId: newRowId(),
        id: key.id,
        label: key.label ?? "",
        apiKey: "",
        unavailableReason: key.unavailable_reason ?? null,
      }),
    );
    return stored.length > 0
      ? stored
      : [{ rowId: newRowId(), label: "", apiKey: "" }];
  });
  const [metaText, setMetaText] = useState(
    stringifyJsonObject(initialProvider?.meta),
  );
  const [rateLimitPerMin, setRateLimitPerMin] = useState(
    String(initialProvider?.rate_limit_per_min ?? 60),
  );
  // Empty, never 0: a rate of 0 would price every credit at nothing.
  const [costToUsdmicro, setCostToUsdmicro] = useState(
    initialProvider?.cost_to_usdmicro != null
      ? String(initialProvider.cost_to_usdmicro)
      : "",
  );

  const multiKey = MULTI_KEY_PROVIDERS.includes(name);
  const updateKey = (rowId: string, patch: Partial<KeyDraft>) =>
    setKeys((prev) =>
      prev.map((k) => (k.rowId === rowId ? { ...k, ...patch } : k)),
    );
  const removeKey = (rowId: string) =>
    setKeys((prev) => prev.filter((k) => k.rowId !== rowId));
  const moveKey = (index: number, delta: -1 | 1) =>
    setKeys((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  const addKey = () =>
    setKeys((prev) => [...prev, { rowId: newRowId(), label: "", apiKey: "" }]);
  // Switching to a single-key provider before saving: keep only the first row.
  const effectiveKeys = multiKey ? keys : keys.slice(0, 1);

  const meta = parseJsonObject(metaText);
  const costValue = costToUsdmicro.trim();
  const costIsValid = !costValue || Number(costValue) > 0;

  const handleReenable = async () => {
    if (!initialProvider) return;
    try {
      await reenableProvider(initialProvider.uuid);
      onClose();
      onSuccess?.();
    } catch {
      // toast handled in hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta.ok || !costIsValid) return;

    const displayNameValue = displayName.trim();
    const baseApiUrlValue = baseApiUrl.trim();
    const rateLimitValue = rateLimitPerMin.trim();

    try {
      if (isEditing && initialProvider) {
        // Edit sends every field, so a cleared one is cleared (null), not left as it was.
        // The key list is sent whole, in the order the keys are tried; a key left out is removed,
        // and a stored key with a blank value keeps its value.
        await updateProvider(initialProvider.uuid, {
          display_name: displayNameValue || null,
          base_api_url: baseApiUrlValue || null,
          api_keys: toKeyRequests(effectiveKeys),
          rate_limit_per_min: rateLimitValue ? Number(rateLimitValue) : null,
          cost_to_usdmicro: costValue ? Number(costValue) : null,
          meta: meta.value,
        });
      } else {
        await createProvider({
          name,
          display_name: displayNameValue || undefined,
          base_api_url: baseApiUrlValue || undefined,
          api_keys: toKeyRequests(effectiveKeys),
          rate_limit_per_min: rateLimitValue
            ? Number(rateLimitValue)
            : undefined,
          cost_to_usdmicro: costValue ? Number(costValue) : undefined,
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
      {isEditing && (
        <div
          className={
            initialProvider?.unavailable_reason
              ? "space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3"
              : "space-y-2 rounded-lg border p-3"
          }
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground text-xs font-semibold">
              {t("features.ai.providers.columns.availability", {
                defaultValue: "وضعیت مسیردهی",
              })}
            </span>
            <Badge variant={availability.variant}>{availability.label}</Badge>
          </div>
          <p className="text-muted-foreground text-[11px] leading-5">
            {availability.hint}
          </p>
          {initialProvider?.unavailable_reason && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={isSubmitting}
              onClick={() => void handleReenable()}
            >
              {t("features.ai.providers.reenable", {
                defaultValue: "فعال‌سازی دستی",
              })}
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.name", {
              defaultValue: "نوع سرویس‌دهنده",
            })}
          </label>
          <Select
            value={name}
            onChange={(e) =>
              setName(e.target.value as AiRegistryProviderNameEnum)
            }
            disabled={isEditing}
          >
            {PROVIDER_NAMES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.displayName", {
              defaultValue: "نام نمایشی",
            })}
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="OpenAI Main Gateway"
          />
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.ai.providers.baseApiUrl", {
            defaultValue: "آدرس Base API URL (اختیاری)",
          })}
        </label>
        <Input
          value={baseApiUrl}
          onChange={(e) => setBaseApiUrl(e.target.value)}
          placeholder="https://api.openai.com/v1"
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <label className="text-foreground block text-xs font-semibold">
          {multiKey
            ? t("features.ai.providers.apiKeys", {
                defaultValue: "کلیدهای دسترسی (API Key)",
              })
            : t("features.ai.providers.apiKey", {
                defaultValue: "کلید دسترسی (API Key)",
              })}
        </label>
        <p className="text-muted-foreground text-[11px] leading-5">
          {multiKey
            ? "کلیدها به ترتیب همین فهرست امتحان می‌شوند. اگر ارائه‌دهنده کلیدی را به‌خاطر موجودی یا اعتبار رد کند، درخواست به کلید بعدی می‌رود. مقدار کلیدهای ثبت‌شده نمایش داده نمی‌شود؛ برای حفظ مقدار، خالی بگذارید."
            : "این ارائه‌دهنده فقط یک کلید می‌پذیرد. مقدار کلید ثبت‌شده نمایش داده نمی‌شود؛ برای حفظ آن خالی بگذارید."}
        </p>
        {isEditing && !initialProvider?.has_api_key && (
          <span className="text-destructive block text-[11px]">
            هیچ کلیدی ثبت نشده است؛ درخواست به این ارائه‌دهنده کار نمی‌کند.
          </span>
        )}
        {effectiveKeys.map((key, index) => {
          const keyAvailability = providerAvailability(key.unavailableReason);
          return (
            <div
              key={key.rowId}
              className="space-y-2 rounded-lg border p-2"
              data-testid="provider-key-row"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-[11px]">
                  {multiKey ? `کلید ${index + 1}` : "کلید"}
                </span>
                <div className="flex items-center gap-1">
                  {key.id && (
                    <Badge
                      variant={keyAvailability.variant}
                      title={keyAvailability.hint}
                    >
                      {keyAvailability.label}
                    </Badge>
                  )}
                  {multiKey && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0"
                        disabled={index === 0}
                        aria-label="انتقال به بالا"
                        onClick={() => moveKey(index, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-7 p-0"
                        disabled={index === effectiveKeys.length - 1}
                        aria-label="انتقال به پایین"
                        onClick={() => moveKey(index, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive size-7 p-0"
                        aria-label="حذف کلید"
                        onClick={() => removeKey(key.rowId)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Input
                  value={key.label}
                  onChange={(e) =>
                    updateKey(key.rowId, { label: e.target.value })
                  }
                  placeholder="برچسب (اختیاری)"
                  maxLength={128}
                />
                <Input
                  className="sm:col-span-2"
                  type="password"
                  value={key.apiKey}
                  onChange={(e) =>
                    updateKey(key.rowId, { apiKey: e.target.value })
                  }
                  placeholder={
                    key.id
                      ? "کلید جدید (برای حفظ قبلی خالی بگذارید)"
                      : "AIza..."
                  }
                  dir="ltr"
                />
              </div>
            </div>
          );
        })}
        {multiKey && effectiveKeys.length < MAX_PROVIDER_KEYS && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={addKey}
          >
            <Plus className="size-3.5" />
            افزودن کلید
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.rateLimit", {
              defaultValue: "سقف درخواست در دقیقه (Rate Limit)",
            })}
          </label>
          <Input
            type="number"
            value={rateLimitPerMin}
            onChange={(e) => setRateLimitPerMin(e.target.value)}
            placeholder="60"
            min={1}
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {t("features.ai.providers.costMicro", {
              defaultValue: "ارزش هر واحد به میکرودلار (usdmicro)",
            })}
          </label>
          <Input
            type="number"
            value={costToUsdmicro}
            onChange={(e) => setCostToUsdmicro(e.target.value)}
            placeholder={name === "KIE" ? "5000" : "1000000"}
            min={0}
            step="any"
            dir="ltr"
            aria-invalid={!costIsValid}
          />
          <span
            className={
              costIsValid
                ? "text-muted-foreground mt-1 block text-[11px] leading-5"
                : "text-destructive mt-1 block text-[11px] leading-5"
            }
          >
            {costIsValid
              ? t("features.ai.providers.costMicroHint", {
                  defaultValue:
                    "قیمت هر credit در KIE (مثلاً 5000) یا هر دلار در Runware (1000000). تغییرش فقط روی درخواست‌های بعدی اثر دارد.",
                })
              : t("features.ai.providers.costMicroInvalid", {
                  defaultValue: "باید بیشتر از صفر باشد؛ صفر یعنی ساخت رایگان.",
                })}
          </span>
          {costIsValid && costValue !== "" && (
            <span className="text-muted-foreground block text-[11px] tabular-nums">
              هر واحد ارائه‌دهنده {tokenHint(costValue)}
            </span>
          )}
        </div>
      </div>

      <details className="rounded-lg border p-3">
        <summary className="cursor-pointer text-xs font-semibold">
          تنظیمات پیشرفته (meta)
        </summary>
        <div className="pt-3">
          <JsonObjectField
            id="provider-meta"
            label="meta (JSON)"
            hint="داده‌های اضافی ارائه‌دهنده؛ خالی یعنی {}."
            value={metaText}
            onChange={setMetaText}
            rows={6}
          />
        </div>
      </details>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !meta.ok || !costIsValid}
        >
          {isSubmitting
            ? t("common.submitting", { defaultValue: "در حال ثبت..." })
            : isEditing
              ? t("common.update", { defaultValue: "بروزرسانی" })
              : t("common.create", { defaultValue: "افزودن" })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AiProviderFormDialog({
  open,
  onOpenChange,
  initialProvider,
  onSuccess,
}: AiProviderFormDialogProps) {
  const { t } = useAppTranslate();
  const isEditing = Boolean(initialProvider);
  // Edit from the full record, never from the list's summary row.
  const { provider, error } = useAiProviderDetail(
    open && initialProvider ? initialProvider.uuid : "",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("features.ai.providers.editTitle", {
                  defaultValue: "ویرایش ارائه‌دهنده هوش مصنوعی",
                })
              : t("features.ai.providers.createTitle", {
                  defaultValue: "افزودن ارائه‌دهنده جدید",
                })}
          </DialogTitle>
          <DialogDescription>
            {t("features.ai.providers.formDesc", {
              defaultValue:
                "تنظیمات اتصال به ارائه‌دهنده، کلید API و سقف درخواست‌ها را مشخص کنید.",
            })}
          </DialogDescription>
        </DialogHeader>

        {open && !isEditing && (
          <AiProviderFormContent
            key="create"
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
        {open && isEditing && provider && (
          <AiProviderFormContent
            key={`${provider.uuid}:${provider.updated_at}`}
            initialProvider={provider}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
        {open && isEditing && !provider && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {error
              ? t("features.ai.providers.loadError", {
                  defaultValue:
                    "بارگذاری اطلاعات ارائه‌دهنده ناموفق بود. پنجره را ببندید و دوباره باز کنید.",
                })
              : t("common.loading", { defaultValue: "در حال بارگذاری..." })}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
