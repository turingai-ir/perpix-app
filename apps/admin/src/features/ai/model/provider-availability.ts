import type { AiRegistryProviderUnavailableReasonEnum } from "./types";

type BadgeVariant = "success" | "warning" | "destructive";

interface AvailabilityView {
  label: string;
  variant: BadgeVariant;
  /** What happens, and what clears it without anyone having to. */
  hint: string;
}

const AVAILABLE: AvailabilityView = {
  label: "فعال",
  variant: "success",
  hint: "درخواست‌های جدید به این ارائه‌دهنده فرستاده می‌شوند.",
};

const UNAVAILABLE: Record<
  AiRegistryProviderUnavailableReasonEnum,
  AvailabilityView
> = {
  OUT_OF_CREDIT: {
    label: "موجودی تمام شده",
    variant: "warning",
    hint: "ارائه‌دهنده گفت موجودی حساب ما تمام شده است. درخواست‌های جدید به ارائه‌دهنده بعدی همان مدل می‌روند و درخواست‌های قبلی تا ۳۰ دقیقه منتظر همین ارائه‌دهنده می‌مانند. بعد از شارژ، با اولین درخواستی که پذیرفته شود این وضعیت خودکار برطرف می‌شود.",
  },
  AUTH_FAILED: {
    label: "کلید API رد شد",
    variant: "destructive",
    hint: "ارائه‌دهنده کلید API ما را نپذیرفت. درخواست‌های جدید به ارائه‌دهنده بعدی همان مدل می‌روند. ذخیرهٔ کلید جدید این وضعیت را همان لحظه برطرف می‌کند.",
  },
};

export function providerAvailability(
  reason: AiRegistryProviderUnavailableReasonEnum | null | undefined,
): AvailabilityView {
  return reason ? UNAVAILABLE[reason] : AVAILABLE;
}
