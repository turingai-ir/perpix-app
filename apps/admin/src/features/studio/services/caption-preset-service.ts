import { apiClient } from "@/services/api";
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "@/utils/custom-fetch/fetch-errors";
import type { SaveCaptionPresetBody } from "../model/caption-preset";

export class CaptionPresetActionError extends Error {
  constructor(
    readonly kind:
      "forbidden" | "not_found" | "validation" | "network" | "server",
    message?: string,
  ) {
    super(message || kind);
    this.name = "CaptionPresetActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof CaptionPresetActionError) throw error;
  if (error instanceof FetchHttpError) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      throw new CaptionPresetActionError(
        "forbidden",
        "اجازه مدیریت قالب‌های کپشن را ندارید.",
      );
    }
    if (status === 404) {
      throw new CaptionPresetActionError(
        "not_found",
        "قالب مورد نظر یافت نشد.",
      );
    }
    if (status === 422) {
      throw new CaptionPresetActionError(
        "validation",
        "اطلاعات قالب معتبر نیست. نام، ترتیب و حجم تنظیمات را بررسی کنید.",
      );
    }
  }
  if (
    error instanceof FetchNetworkError ||
    error instanceof FetchTimeoutError
  ) {
    throw new CaptionPresetActionError(
      "network",
      "خطای ارتباط با سرور. اتصال اینترنت خود را بررسی کنید.",
    );
  }
  throw new CaptionPresetActionError(
    "server",
    "خطای غیرمنتظره در مدیریت قالب کپشن رخ داد.",
  );
}

export async function createCaptionPreset(body: SaveCaptionPresetBody) {
  try {
    const result = await apiClient.POST(
      "/api/admin/v1/studio/caption-presets",
      { body },
    );
    if (result.error) throw new CaptionPresetActionError("server");
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function updateCaptionPreset(
  presetUuid: string,
  body: SaveCaptionPresetBody,
) {
  try {
    const result = await apiClient.PUT(
      "/api/admin/v1/studio/caption-presets/{preset_uuid}",
      { params: { path: { preset_uuid: presetUuid } }, body },
    );
    if (result.error) throw new CaptionPresetActionError("server");
    return result.data;
  } catch (error) {
    handleFetchError(error);
  }
}

export async function deleteCaptionPreset(presetUuid: string) {
  try {
    const result = await apiClient.DELETE(
      "/api/admin/v1/studio/caption-presets/{preset_uuid}",
      { params: { path: { preset_uuid: presetUuid } } },
    );
    if (result.error) throw new CaptionPresetActionError("server");
  } catch (error) {
    handleFetchError(error);
  }
}
