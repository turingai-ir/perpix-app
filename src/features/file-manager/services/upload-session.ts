import type { SchemaFileManagerMultipartCompleteRequest } from "@/services/api/api";

// Only explicit retries in this tab can reuse an unfinished completion.
// There is no persistence, mount recovery, or replay on reconnection.
const completions = new Map<
  string,
  SchemaFileManagerMultipartCompleteRequest
>();
export const fileUploadKey = (scope: string, file: File) =>
  `${scope}:${file.name}:${file.size}:${file.lastModified}`;
export const getCompletion = (key: string) => completions.get(key);
export const saveCompletion = (
  key: string,
  body: SchemaFileManagerMultipartCompleteRequest,
) => {
  completions.set(key, body);
};
export const removeCompletion = (key: string) => {
  completions.delete(key);
};
export const clearUploadSession = () => {
  completions.clear();
};
