import type { SchemaFileManagerMultipartCompleteRequest } from "@/services/api/api";
const completions = new Map<
  string,
  SchemaFileManagerMultipartCompleteRequest
>();
export const uploadKey = (scope: string, file: File) =>
  `${scope}:${file.name}:${file.size}:${file.lastModified}`;
export const getCompletion = (key: string) => completions.get(key);
export function saveCompletion(
  key: string,
  body: SchemaFileManagerMultipartCompleteRequest,
) {
  completions.set(key, body);
}
export function forgetCompletion(key: string) {
  completions.delete(key);
}
export const removeCompletion = forgetCompletion;
export function clearUploadSession() {
  completions.clear();
}
