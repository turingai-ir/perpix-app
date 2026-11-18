import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useSubscriptionActions } from "../hooks/use-subscription-actions";
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
import { UsdmicroInputHint } from "@/components/custom/usdmicro-amount";
import { parseUsdmicro } from "@/utils/usdmicro";
import type { PlansRowItem } from "../hooks/use-plans-list";
import {
  MAX_CAPTION_PRESET_LIMIT,
  hasStudioScopes,
  parseCaptionPresetLimit,
  parseScopes,
  readCaptionPresetLimit,
  toPlanSettings,
  withStudioScopes,
} from "../model/plan-settings";
import { UsdmicroInput } from "@/components/custom/usdmicro-input";

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: PlansRowItem | null;
  onSuccess?: () => void;
}

function PlanFormContent({
  initialPlan,
  onClose,
  onSuccess,
}: {
  initialPlan?: PlansRowItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPlan);

  const [name, setName] = useState(initialPlan?.name ?? "");
  const [displayName, setDisplayName] = useState(
    initialPlan?.display_name ?? "",
  );
  const [description, setDescription] = useState(
    initialPlan?.description ?? "",
  );
  const [durationDays, setDurationDays] = useState(
    String(initialPlan?.duration_days ?? 30),
  );

  const baseMicro =
    (initialPlan as unknown as { base_price_usdmicro?: number })
      ?.base_price_usdmicro ?? 0;
  const discMicro =
    (initialPlan as unknown as { discounted_price_usdmicro?: number })
      ?.discounted_price_usdmicro ?? 0;

  const [basePriceUsdmicro, setBasePriceUsdmicro] = useState(String(baseMicro));
  const [discountedPriceUsdmicro, setDiscountedPriceUsdmicro] = useState(
    String(discMicro),
  );
  const [giftAmountUsdmicro, setGiftAmountUsdmicro] = useState(
    String(initialPlan?.balance_gift_amount_usdmicro ?? 0),
  );
  const [scopesStr, setScopesStr] = useState(
    initialPlan?.scopes ? Array.from(initialPlan.scopes).join(", ") : "",
  );
  const [allowedModelsStr, setAllowedModelsStr] = useState(
    initialPlan?.allowed_models
      ? Array.from(initialPlan.allowed_models).join(", ")
      : "",
  );
  const [captionPresetLimit, setCaptionPresetLimit] = useState(
    String(readCaptionPresetLimit(initialPlan?.settings)),
  );
  const [isActive, setIsActive] = useState(initialPlan?.is_active ?? true);
  const [isRecommended, setIsRecommended] = useState(
    initialPlan?.is_recommended ?? false,
  );
  const [isDefault, setIsDefault] = useState(initialPlan?.is_default ?? false);

  const { createPlan, updatePlan, isCreatingPlan, isUpdatingPlan } =
    useSubscriptionActions();
  const isSubmitting = isCreatingPlan || isUpdatingPlan;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedBaseMicro = parseUsdmicro(basePriceUsdmicro || "0");
    const parsedDiscMicro = parseUsdmicro(discountedPriceUsdmicro || "0");
    const parsedGiftMicro = parseUsdmicro(giftAmountUsdmicro || "0");
    if (
      parsedBaseMicro === null ||
      parsedDiscMicro === null ||
      parsedGiftMicro === null
    ) {
      return;
    }

    const parsedPresetLimit = parseCaptionPresetLimit(captionPresetLimit);
    if (parsedPresetLimit === null) return;

    const scopes = parseScopes(scopesStr);

    const settings = toPlanSettings(initialPlan?.settings, {
      captionPresetLimit: parsedPresetLimit,
    });

    const allowedModels = allowedModelsStr
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    try {
      if (isEdit && initialPlan) {
        await updatePlan({
          planUuid: initialPlan.uuid,
          body: {
            display_name: displayName.trim() || undefined,
            description: description.trim() || undefined,
            is_active: isActive,
            is_recommended: isRecommended,
            is_default: isDefault,
            base_price_usdmicro: parsedBaseMicro,
            discounted_price_usdmicro: parsedDiscMicro,
            balance_gift_amount_usdmicro: parsedGiftMicro,
            scopes,
            allowed_models: allowedModels,
            settings,
          },
        });
      } else {
        await createPlan({
          name: name.trim(),
          display_name: displayName.trim() || undefined,
          description: description.trim() || undefined,
          duration_days: parseInt(durationDays, 10) || 30,
          base_price_usdmicro: parsedBaseMicro,
          discounted_price_usdmicro: parsedDiscMicro,
          balance_gift_amount_usdmicro: parsedGiftMicro,
          scopes,
          allowed_models: allowedModels,
          settings,
          is_active: isActive,
          is_recommended: isRecommended,
          is_default: isDefault,
        });
      }
      onClose();
      onSuccess?.();
    } catch {
      // toast is handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.name", {
              defaultValue: "نام سیستمی پلن",
            })}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isEdit}
            placeholder="pro-monthly"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.displayName", {
              defaultValue: "نام نمایشی پلن",
            })}
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="پلن حرفه‌ای ماهانه"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.subscriptions.plans.fields.description", {
            defaultValue: "توضیحات پلن",
          })}
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="دسترسی نامحدود به مدل‌های پیشرفته..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.durationDays", {
              defaultValue: "مدت اعتبار (روز)",
            })}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            min={1}
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            disabled={isEdit}
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.giftAmountUsd", {
              defaultValue: "مبلغ هدیه کیف پول (میکرودلار)",
            })}
          </label>
          <UsdmicroInput
            value={giftAmountUsdmicro}
            onValueChange={(v) => setGiftAmountUsdmicro(v)}
          />
          <UsdmicroInputHint value={giftAmountUsdmicro} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.basePriceUsd", {
              defaultValue: "قیمت پایه (میکرودلار)",
            })}
          </label>
          <UsdmicroInput
            value={basePriceUsdmicro}
            onValueChange={(v) => setBasePriceUsdmicro(v)}
          />
          <UsdmicroInputHint value={basePriceUsdmicro} />
        </div>

        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-semibold">
            {t("features.subscriptions.plans.fields.discountedPriceUsd", {
              defaultValue: "قیمت با تخفیف (میکرودلار)",
            })}
          </label>
          <UsdmicroInput
            value={discountedPriceUsdmicro}
            onValueChange={(v) => setDiscountedPriceUsdmicro(v)}
          />
          <UsdmicroInputHint value={discountedPriceUsdmicro} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.subscriptions.plans.fields.scopes", {
            defaultValue: "دسترسی‌ها (با کاما جدا کنید)",
          })}
        </label>
        <Input
          value={scopesStr}
          onChange={(e) => setScopesStr(e.target.value)}
          placeholder="ai:chat, ai:image"
          dir="ltr"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-foreground text-xs font-semibold">
          {t("features.subscriptions.plans.fields.allowedModels", {
            defaultValue: "مدل‌های مجاز (با کاما جدا کنید)",
          })}
        </label>
        <textarea
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
          value={allowedModelsStr}
          onChange={(e) => setAllowedModelsStr(e.target.value)}
          placeholder="gpt-4o, claude-3-5-sonnet"
          dir="ltr"
        />
      </div>

      <section className="border-border space-y-3 rounded-lg border p-3">
        <div>
          <h3 className="text-foreground text-sm font-bold">
            {t("features.subscriptions.plans.settings.title", {
              defaultValue: "تنظیمات",
            })}
          </h3>
          <p className="text-muted-foreground text-xs">
            {t("features.subscriptions.plans.settings.description", {
              defaultValue:
                "محدودیت‌ها و امکانات هر بخش از محصول برای کاربران این پلن.",
            })}
          </p>
        </div>

        <div className="bg-muted/30 space-y-3 rounded-md p-3">
          <h4 className="text-foreground text-xs font-bold">
            {t("features.subscriptions.plans.settings.studio.title", {
              defaultValue: "استودیو",
            })}
          </h4>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={hasStudioScopes(parseScopes(scopesStr))}
              onChange={(e) =>
                setScopesStr(
                  withStudioScopes(
                    parseScopes(scopesStr),
                    e.target.checked,
                  ).join(", "),
                )
              }
              className="text-primary focus:ring-primary size-4 rounded"
            />
            <span>
              {t("features.subscriptions.plans.settings.studio.enabled", {
                defaultValue: "دسترسی به استودیو",
              })}
            </span>
          </label>
          <p className="text-muted-foreground text-xs" dir="ltr">
            studio:read, studio:write
          </p>

          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-semibold">
              {t(
                "features.subscriptions.plans.settings.studio.captionPresetLimit",
                {
                  defaultValue: "تعداد قالب کپشن ذخیره‌شده برای هر کاربر",
                },
              )}
            </label>
            <Input
              type="number"
              min={0}
              max={MAX_CAPTION_PRESET_LIMIT}
              step={1}
              value={captionPresetLimit}
              onChange={(e) => setCaptionPresetLimit(e.target.value)}
              dir="ltr"
            />
            <p className="text-muted-foreground text-xs">
              {t(
                "features.subscriptions.plans.settings.studio.captionPresetLimitHint",
                {
                  defaultValue:
                    "صفر یعنی کاربر فقط از قالب‌های ادمین استفاده می‌کند. حداکثر ۱۰۰.",
                },
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="text-primary focus:ring-primary size-4 rounded"
            />
            <span>
              {t("features.subscriptions.plans.fields.isActive", {
                defaultValue: "پلن فعال و قابل خرید باشد",
              })}
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
              className="text-primary focus:ring-primary size-4 rounded"
            />
            <span>
              {t("features.subscriptions.plans.fields.isRecommended", {
                defaultValue: "پیشنهاد ویژه (Recommended)",
              })}
            </span>
          </label>

          {isEdit && (
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="text-primary focus:ring-primary size-4 rounded"
              />
              <span>
                {t("features.subscriptions.plans.fields.isDefault", {
                  defaultValue: "پلن پیش‌فرض",
                })}
              </span>
            </label>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="cursor-pointer gap-2"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isEdit
            ? t("common.save", { defaultValue: "ذخیره تغییرات" })
            : t("features.subscriptions.plans.createSubmit", {
                defaultValue: "ایجاد پلن",
              })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function PlanFormDialog({
  open,
  onOpenChange,
  initialPlan,
  onSuccess,
}: PlanFormDialogProps) {
  const { t } = useAppTranslate();
  const isEdit = Boolean(initialPlan);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            <DialogTitle>
              {isEdit
                ? t("features.subscriptions.plans.editTitle", {
                    defaultValue: "ویرایش پلن اشتراک",
                  })
                : t("features.subscriptions.plans.createTitle", {
                    defaultValue: "ایجاد پلن اشتراک جدید",
                  })}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEdit
              ? t("features.subscriptions.plans.editDesc", {
                  defaultValue: "مشخصات و قیمت پلن اشتراک را به‌روزرسانی کنید.",
                })
              : t("features.subscriptions.plans.createDesc", {
                  defaultValue:
                    "پلن اشتراک جدید برای دسترسی کاربران به خدمات تعریف کنید.",
                })}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <PlanFormContent
            key={initialPlan ? initialPlan.uuid : "create"}
            initialPlan={initialPlan}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogPopup>
    </Dialog>
  );
}
