import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";
import {
  createCaptionPreset,
  deleteCaptionPreset,
  updateCaptionPreset,
} from "../services/caption-preset-service";
import type { SaveCaptionPresetBody } from "../model/caption-preset";

export function useCaptionPresetActions() {
  const queryClient = useQueryClient();
  const { t } = useAppTranslate();

  const refresh = () => {
    void queryClient.invalidateQueries();
  };
  const fail = (error: Error) => {
    toast.error(
      error.message ||
        t("features.studio.captionPresets.actions.error", {
          defaultValue: "عملیات روی قالب کپشن با خطا مواجه شد.",
        }),
    );
  };

  const createMutation = useMutation({
    mutationFn: (body: SaveCaptionPresetBody) => createCaptionPreset(body),
    onSuccess: () => {
      toast.success(
        t("features.studio.captionPresets.actions.createSuccess", {
          defaultValue: "قالب کپشن ساخته شد.",
        }),
      );
      refresh();
    },
    onError: fail,
  });

  const updateMutation = useMutation({
    mutationFn: (params: { presetUuid: string; body: SaveCaptionPresetBody }) =>
      updateCaptionPreset(params.presetUuid, params.body),
    onSuccess: () => {
      toast.success(
        t("features.studio.captionPresets.actions.updateSuccess", {
          defaultValue: "قالب کپشن ذخیره شد.",
        }),
      );
      refresh();
    },
    onError: fail,
  });

  const deleteMutation = useMutation({
    mutationFn: (presetUuid: string) => deleteCaptionPreset(presetUuid),
    onSuccess: () => {
      toast.success(
        t("features.studio.captionPresets.actions.deleteSuccess", {
          defaultValue: "قالب کپشن حذف شد.",
        }),
      );
      refresh();
    },
    onError: fail,
  });

  return {
    createPreset: createMutation.mutateAsync,
    updatePreset: updateMutation.mutateAsync,
    deletePreset: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
