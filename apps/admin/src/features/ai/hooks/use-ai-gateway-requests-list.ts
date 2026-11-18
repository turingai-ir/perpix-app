import { useReactQueryApi } from "@/hooks";
import type {
  AdminSort,
  GenerationDetail,
  GenerationReviewReasonEnum,
  GenerationStatusEnum,
} from "../model/types";

export interface UseAiGatewayRequestsListParams {
  page?: number;
  limit?: number;
  sort?: AdminSort;
  createdFrom?: string;
  createdTo?: string;
  resourceUuid?: string;
  userUuid?: string;
  search?: string;
  status?: GenerationStatusEnum | "ALL";
  reviewReason?: GenerationReviewReasonEnum;
  openOnly?: boolean;
  modelUuid?: string;
  providerUuid?: string;
}

export type AiGatewayRequestsRowItem = GenerationDetail;

export function useAiGatewayRequestsList({
  page = 1,
  limit = 10,
  sort = "-created_at",
  createdFrom,
  createdTo,
  resourceUuid,
  userUuid,
  search,
  status,
  reviewReason,
  openOnly,
  modelUuid,
  providerUuid,
}: UseAiGatewayRequestsListParams = {}) {
  const api = useReactQueryApi();
  const offset = (page - 1) * limit;

  const queryParams = {
    offset,
    limit,
    sort,
    created_from: createdFrom || undefined,
    created_to: createdTo || undefined,
    resource_uuid: resourceUuid || undefined,
    user_uuid: userUuid || undefined,
    search: search || undefined,
    status:
      status && status !== "ALL" ? (status as GenerationStatusEnum) : undefined,
    review_reason: reviewReason,
    open_only: openOnly || undefined,
    model_uuid: modelUuid || undefined,
    provider_uuid: providerUuid || undefined,
  };

  const { data, isLoading, error, refetch } = api.useQuery(
    "get",
    "/api/admin/v1/ai-gateway/generations",
    {
      params: {
        query: queryParams,
      },
    },
  );

  return {
    requests: (data?.items ?? []) as unknown as AiGatewayRequestsRowItem[],
    totalCount: data?.total_count ?? 0,
    hasMore: data?.has_next ?? false,
    isLoading,
    error,
    refetch,
  };
}
