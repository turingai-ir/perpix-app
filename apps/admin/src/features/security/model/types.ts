import type { components } from "@/services/api/api";

export type AdminSort = components["schemas"]["AdminSort"];

export type SessionsRow = components["schemas"]["SessionsRow"];
export type AdminPageSessionsRow =
  components["schemas"]["AdminPage_SessionsRow_"];

export type TokensRow = components["schemas"]["TokensRow"];
export type AdminPageTokensRow = components["schemas"]["AdminPage_TokensRow_"];

export type AuditRow = components["schemas"]["AuditRow"];
export type AdminPageAuditRow = components["schemas"]["AdminPage_AuditRow_"];

export type AdminReportBucket = components["schemas"]["AdminReportBucket"];
export type AdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];

export type SecurityStatusEnum = "active" | "revoked" | "expired";
