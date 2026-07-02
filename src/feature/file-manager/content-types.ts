export const FILE_MANAGER_ALLOWED_CONTENT_TYPES = [
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "image/jpeg",
  "image/png",
  "video/mp4",
] as const;

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
