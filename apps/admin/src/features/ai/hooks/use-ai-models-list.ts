import { useReactQueryApi } from "@/hooks";
import type {
  AdminSort,
  AiRegistryModelOwnerEnum,
  AiRegistryModelSupportedTypesEnum,
  ModelsRow,
} from "../model/types";

export interface UseAiModelsListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
  tag?: string;
  inputType?: AiRegistryModelSupportedTypesEnum;
  outputType?: AiRegistryModelSupportedTypesEnum;
  providerUuid?: string;
  resourceUuid?: string;
  search?: string;
  isActive?: boolean;
  modelOwner?: AiRegistryModelOwnerEnum | "ALL";
}

export type AiModelsRowItem = ModelsRow;

export function useAiModelsList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  createdFrom,
  createdTo,
  tag,
  inputType,
  outputType,
  providerUuid,
  resourceUuid,
  search,
  isActive,
  modelOwner,
}: UseAiModelsListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    tag: tag || undefined,
    input_type: inputType || undefined,
    output_type: outputType || undefined,
    provider_uuid: providerUuid || undefined,
    resource_uuid: resourceUuid || undefined,
    search: search || undefined,
    is_active: isActive,
    model_owner:
      modelOwner && modelOwner !== "ALL"
        ? (modelOwner as AiRegistryModelOwnerEnum)
        : undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/ai-registry/models",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    models: (data?.items ?? []) as unknown as AiModelsRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
