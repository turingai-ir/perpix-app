import type { components } from "@/services/api/api";

export type AdminSort = components["schemas"]["AdminSort"];

// AI Task
export type TasksRow = components["schemas"]["TasksRow"];
export type AdminPageTasksRow = components["schemas"]["AdminPage_TasksRow_"];
export type AiTaskTypeEnum = components["schemas"]["AiTaskTypeEnum"];
export type MessageRow = components["schemas"]["MessageRow"];
export type AdminPageMessageRow =
  components["schemas"]["AdminPage_MessageRow_"];
export type AiTaskMessageResponse =
  components["schemas"]["AiTaskMessageResponse"];

// AI Gateway
export type GenerationDetail = components["schemas"]["GenerationDetail"];
export type AdminPageGenerationDetail =
  components["schemas"]["AdminPage_GenerationDetail_"];
export type GenerationStatusEnum =
  components["schemas"]["GenerationStatusEnum"];
export type GenerationReviewResponse =
  components["schemas"]["GenerationReviewResponse"];
export type GenerationSetCostRequest =
  components["schemas"]["GenerationSetCostRequest"];
export type GenerationExternalTaskRequest =
  components["schemas"]["GenerationExternalTaskRequest"];
export type GenerationReviewReasonEnum =
  components["schemas"]["GenerationReviewReasonEnum"];

// AI Registry Models
export type ModelsRow = components["schemas"]["ModelsRow"];
export type AdminPageModelsRow = components["schemas"]["AdminPage_ModelsRow_"];
export type AiRegistryModelDetail =
  components["schemas"]["AiRegistryModelDetail"];
export type AiRegistryModelOwnerEnum =
  components["schemas"]["AiRegistryModelOwnerEnum"];
export type AiRegistryModelSupportedTypesEnum =
  components["schemas"]["AiRegistryModelSupportedTypesEnum"];
export type AiRegistryModelCreateRequest =
  components["schemas"]["AiRegistryModelCreateRequest"];
export type AiRegistryModelUpdateRequest =
  components["schemas"]["AiRegistryModelUpdateRequest"];
export type AiRegistryModelProviderLinkCreateRequest =
  components["schemas"]["AiRegistryModelProviderLinkCreateRequest"];
export type AiRegistryModelProviderLinkUpdateRequest =
  components["schemas"]["AiRegistryModelProviderLinkUpdateRequest"];
export type AiRegistryModelProviderLinkDetail =
  components["schemas"]["AiRegistryModelProviderLinkDetail"];
export type AiRegistryModelProviderOrderRequest =
  components["schemas"]["AiRegistryModelProviderOrderRequest"];

// AI Registry Providers
export type ProvidersRow = components["schemas"]["ProvidersRow"];
export type AdminPageProvidersRow =
  components["schemas"]["AdminPage_ProvidersRow_"];
export type AiRegistryProviderDetail =
  components["schemas"]["AiRegistryProviderDetail"];
export type AiRegistryProviderNameEnum =
  components["schemas"]["AiRegistryProviderNameEnum"];
export type AiRegistryProviderUnavailableReasonEnum =
  components["schemas"]["AiRegistryProviderUnavailableReasonEnum"];
export type AiRegistryProviderKeyDetail =
  components["schemas"]["AiRegistryProviderKeyDetail"];
export type AiRegistryProviderKeyRequest =
  components["schemas"]["AiRegistryProviderKeyRequest"];
export type AiRegistryProviderCreateRequest =
  components["schemas"]["AiRegistryProviderCreateRequest"];
export type AiRegistryProviderUpdateRequest =
  components["schemas"]["AiRegistryProviderUpdateRequest"];

// Reports
export type AdminReportBucket = components["schemas"]["AdminReportBucket"];
export type AdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];
