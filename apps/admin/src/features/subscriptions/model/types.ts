import type { components } from "@/services/api/api";

export type SubscriptionsRow = components["schemas"]["SubscriptionsRow"];
export type AdminPageSubscriptionsRow =
  components["schemas"]["AdminPage_SubscriptionsRow_"];
export type PlansRow = components["schemas"]["PlansRow"];
export type AdminPagePlansRow = components["schemas"]["AdminPage_PlansRow_"];
export type SubscriptionPlanResponse =
  components["schemas"]["SubscriptionPlanResponse"];
export type CreateSubscriptionPlanRequest =
  components["schemas"]["CreateSubscriptionPlanRequest"];
export type UpdateSubscriptionPlanRequest =
  components["schemas"]["UpdateSubscriptionPlanRequest"];
export type ActivateUserSubscriptionRequest =
  components["schemas"]["ActivateUserSubscriptionRequest"];
export type DeactivateUserSubscriptionRequest =
  components["schemas"]["DeactivateUserSubscriptionRequest"];
export type UserSubscriptionResponse =
  components["schemas"]["UserSubscriptionResponse"];
export type SubscriptionOperationRow =
  components["schemas"]["SubscriptionOperationRow"];
export type AdminPageSubscriptionOperationRow =
  components["schemas"]["AdminPage_SubscriptionOperationRow_"];
export type AdminReportBucket = components["schemas"]["AdminReportBucket"];
export type AdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];
export type AdminSort = components["schemas"]["AdminSort"];

export type SubscriptionStatus =
  "active" | "expired" | "replaced" | "scheduled";

export interface SubscriptionsFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  created_from?: string | null;
  created_to?: string | null;
  expires_from?: string | null;
  expires_to?: string | null;
  resource_uuid?: string | null;
  user_uuid?: string | null;
  search?: string | null;
  plan_uuid?: string | null;
  status?: SubscriptionStatus | null;
}

export interface PlansFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  created_from?: string | null;
  created_to?: string | null;
  resource_uuid?: string | null;
  search?: string | null;
  is_active?: boolean | null;
  is_default?: boolean | null;
}

export interface OperationsFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  created_from?: string | null;
  created_to?: string | null;
  actor_uuid?: string | null;
  user_uuid?: string | null;
}
