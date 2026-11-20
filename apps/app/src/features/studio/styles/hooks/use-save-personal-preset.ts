import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CAPTION_CONFIG_SCHEMA_VERSION,
  type CaptionTemplate,
} from "@perpix/caption-renderer";
import { useReactQueryApi } from "@/shared/hooks/app";
import { FetchHttpError } from "@/shared/utils/custom-fetch/fetch-errors";
import { presetsKey } from "./use-presets";

export function useSavePersonalPreset() {
  const client = useQueryClient();
  const { useMutation } = useReactQueryApi();
  const [error, setError] = useState<"limit" | "generic" | null>(null);
  const mutation = useMutation("post", "/api/v1/studio/caption-presets/mine", {
    onSuccess: () => client.invalidateQueries({ queryKey: presetsKey }),
  });

  const save = async (
    name: string,
    config: CaptionTemplate,
  ): Promise<boolean> => {
    setError(null);
    try {
      await mutation.mutateAsync({
        body: {
          name,
          config: { ...config },
          schema_version: CAPTION_CONFIG_SCHEMA_VERSION,
        },
      });
    } catch (failure) {
      const data =
        failure instanceof FetchHttpError && failure.response.status === 409
          ? await failure.parseJson()
          : null;
      if (
        data &&
        typeof data === "object" &&
        "status_code" in data &&
        data.status_code === 1901
      ) {
        setError("limit");
        void client.invalidateQueries({ queryKey: presetsKey });
      } else {
        setError("generic");
      }
      return false;
    }
    return true;
  };

  return { save, pending: mutation.isPending, error };
}
