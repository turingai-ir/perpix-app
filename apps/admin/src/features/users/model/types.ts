import type { components } from "@/services/api/api";

export type UsersRow = components["schemas"]["UsersRow"];
export type AdminPageUsersRow = components["schemas"]["AdminPage_UsersRow_"];
export type AdminSessionResponse =
  components["schemas"]["AdminSessionResponse"];
export type AdminSessionListResponse =
  components["schemas"]["AdminSessionListResponse"];
export type AdminReasonRequest = components["schemas"]["AdminReasonRequest"];
export type SuperadminDeleteUserRequest =
  components["schemas"]["SuperadminDeleteUserRequest"];
export type AdminSort = components["schemas"]["AdminSort"];

export type UserRole = "user" | "admin" | "superadmin";

export interface UsersFilterParams {
  offset?: number;
  limit?: number;
  sort?: AdminSort;
  search?: string | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
  role?: UserRole | null;
  plan_uuid?: string | null;
  created_from?: string | null;
  created_to?: string | null;
  resource_uuid?: string | null;
  user_uuid?: string | null;
}
