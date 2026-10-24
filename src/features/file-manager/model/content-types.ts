export const FILE_MANAGER_ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
] as const;
export type FileManagerAllowedContentType =
  (typeof FILE_MANAGER_ALLOWED_CONTENT_TYPES)[number];

const extensions: Record<string, readonly string[]> = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".mp4": ["video/mp4"],
  ".mov": ["video/quicktime"],
  ".webm": ["video/webm"],
  ".mp3": ["audio/mpeg", "audio/mp3"],
  ".wav": ["audio/wav", "audio/wave", "audio/x-wav"],
  ".m4a": ["audio/mp4", "audio/x-m4a"],
};
export function resolveFileManagerContentTypes(
  acceptList: readonly string[],
): FileManagerAllowedContentType[] {
  const accepted = acceptList
    .flatMap((accept) => accept.toLowerCase().split(","))
    .map((accept) => accept.trim())
    .filter(Boolean);
  return FILE_MANAGER_ALLOWED_CONTENT_TYPES.filter(
    (type) =>
      !accepted.length ||
      accepted.some(
        (accept) =>
          accept === type ||
          (accept.endsWith("/*") && type.startsWith(accept.slice(0, -1))) ||
          extensions[accept]?.includes(type),
      ),
  );
}
