import type { components } from "@/services/api/api";

export type AdminSort = components["schemas"]["AdminSort"];

export type FilesRow = components["schemas"]["FilesRow"];
export type AdminPageFilesRow = components["schemas"]["AdminPage_FilesRow_"];

export type FileManagerAdminFileResponse =
  components["schemas"]["FileManagerAdminFileResponse"];
export type FileManagerAdminUpdateFileRequest =
  components["schemas"]["FileManagerAdminUpdateFileRequest"];
export type FileManagerAdminDeleteBulkRequest =
  components["schemas"]["FileManagerAdminDeleteBulkRequest"];
export type FileManagerAdminDeleteBulkResponse =
  components["schemas"]["FileManagerAdminDeleteBulkResponse"];
export type FileManagerPresignedUrlsResponse =
  components["schemas"]["FileManagerPresignedUrlsResponse"];

export type AdminReportBucket = components["schemas"]["AdminReportBucket"];
export type AdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];
