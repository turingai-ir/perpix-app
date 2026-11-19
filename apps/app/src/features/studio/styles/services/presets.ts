import { apiClient } from "@/shared/api";
import { presetsSchema } from "../model/preset";

export const listPresets = async (signal?: AbortSignal) => {
  const { data } = await apiClient.GET("/api/v1/studio/caption-presets", {
    signal,
  });
  return presetsSchema.parse(data);
};
