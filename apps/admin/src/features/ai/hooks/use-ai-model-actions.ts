import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  createAiModel,
  updateAiModel,
  addProviderToModel,
  updateModelProviderLink,
  reorderModelProviders,
  reorderAiModels,
  AiActionError,
} from "../services/ai-service";
import type {
  AiRegistryModelCreateRequest,
  AiRegistryModelUpdateRequest,
  AiRegistryModelProviderLinkCreateRequest,
  AiRegistryModelProviderLinkUpdateRequest,
} from "../model/types";
import { useAppTranslate } from "@/hooks";

/**
 * Runs one mutation with a pending flag and success/error toasts. Errors are
 * toasted and re-thrown so callers can keep dialogs open on failure.
 */
function useAction() {
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async <T>(
      action: () => Promise<T>,
      messages: { success?: string; error: string },
    ): Promise<T> => {
      setPending(true);
      try {
        const result = await action();
        if (messages.success) toast.success(messages.success);
        return result;
      } catch (err) {
        toast.error(
          err instanceof AiActionError ? err.message : messages.error,
        );
        throw err;
      } finally {
        setPending(false);
      }
    },
    [],
  );

  return { pending, run };
}

export function useAiModelActions() {
  const { t } = useAppTranslate();
  const create = useAction();
  const update = useAction();
  const add = useAction();
  const updateLink = useAction();
  const reorder = useAction();
  const reorderCatalog = useAction();

  return {
    createModel: (body: AiRegistryModelCreateRequest) =>
      create.run(() => createAiModel(body), {
        success: t("features.ai.models.createSuccess", {
          defaultValue: "مدل هوش مصنوعی با موفقیت ایجاد شد.",
        }),
        error: t("features.ai.models.createError", {
          defaultValue: "ایجاد مدل ناموفق بود.",
        }),
      }),

    updateModel: (modelUuid: string, body: AiRegistryModelUpdateRequest) =>
      update.run(() => updateAiModel(modelUuid, body), {
        success: t("features.ai.models.updateSuccess", {
          defaultValue: "اطلاعات مدل با موفقیت بروزرسانی شد.",
        }),
        error: t("features.ai.models.updateError", {
          defaultValue: "بروزرسانی مدل ناموفق بود.",
        }),
      }),

    addProvider: (
      modelUuid: string,
      body: AiRegistryModelProviderLinkCreateRequest,
    ) =>
      add.run(() => addProviderToModel(modelUuid, body), {
        success: t("features.ai.models.addProviderSuccess", {
          defaultValue: "ارائه‌دهنده با موفقیت به مدل متصل شد.",
        }),
        error: t("features.ai.models.addProviderError", {
          defaultValue: "اتصال ارائه‌دهنده به مدل ناموفق بود.",
        }),
      }),

    updateProviderLink: (
      modelUuid: string,
      providerUuid: string,
      body: AiRegistryModelProviderLinkUpdateRequest,
    ) =>
      updateLink.run(
        () => updateModelProviderLink(modelUuid, providerUuid, body),
        {
          success: t("features.ai.models.updateProviderLinkSuccess", {
            defaultValue: "تنظیمات اتصال ارائه‌دهنده بروزرسانی شد.",
          }),
          error: t("features.ai.models.updateProviderLinkError", {
            defaultValue: "بروزرسانی اتصال ارائه‌دهنده ناموفق بود.",
          }),
        },
      ),

    /** `providerUuids` must contain every linked provider; first = preferred. */
    reorderProviders: (
      modelUuid: string,
      providerUuids: readonly string[],
      options: { silent?: boolean } = {},
    ) =>
      reorder.run(() => reorderModelProviders(modelUuid, providerUuids), {
        success: options.silent
          ? undefined
          : t("features.ai.models.reorderSuccess", {
              defaultValue: "اولویت ارائه‌دهندگان ذخیره شد.",
            }),
        error: t("features.ai.models.reorderError", {
          defaultValue: "ذخیرهٔ اولویت ارائه‌دهندگان ناموفق بود.",
        }),
      }),

    /** Models of one kind, shown first first; they swap only among their own places. */
    reorderModels: (modelUuids: readonly string[]) =>
      reorderCatalog.run(() => reorderAiModels(modelUuids), {
        success: t("features.ai.models.reorderModelsSuccess", {
          defaultValue: "ترتیب نمایش مدل‌ها ذخیره شد.",
        }),
        error: t("features.ai.models.reorderModelsError", {
          defaultValue: "ذخیرهٔ ترتیب نمایش مدل‌ها ناموفق بود.",
        }),
      }),

    isCreatingModel: create.pending,
    isUpdatingModel: update.pending,
    isAddingProvider: add.pending,
    isUpdatingProviderLink: updateLink.pending,
    isReorderingProviders: reorder.pending,
    isReorderingModels: reorderCatalog.pending,
  };
}
