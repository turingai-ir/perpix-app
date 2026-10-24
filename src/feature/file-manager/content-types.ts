import { FILE_MANAGER_ALLOWED_CONTENT_TYPES } from "@/features/file-manager";
export { FILE_MANAGER_ALLOWED_CONTENT_TYPES };

export type FileManagerAllowedContentType =
  (typeof FILE_MANAGER_ALLOWED_CONTENT_TYPES)[number];

export function resolveFileManagerContentTypes(
  acceptList: readonly string[],
): FileManagerAllowedContentType[] {
  const normalizedAcceptList = acceptList
    .flatMap((accept) => accept.split(","))
    .map((accept) => accept.trim())
    .filter(Boolean);

  if (normalizedAcceptList.length === 0) {
    return [...FILE_MANAGER_ALLOWED_CONTENT_TYPES];
  }

  return FILE_MANAGER_ALLOWED_CONTENT_TYPES.filter((contentType) =>
    normalizedAcceptList.some((accept) => {
      if (accept.endsWith("/*")) {
        return contentType.startsWith(accept.slice(0, -1));
      }

      return contentType === accept;
    }),
  );
}
