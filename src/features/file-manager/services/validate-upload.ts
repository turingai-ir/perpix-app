import { FILE_MANAGER_ALLOWED_CONTENT_TYPES } from "../model/contracts";
import { FileError } from "../model/file-error";

export async function validateUpload(file: File, accepted: readonly string[]) {
  if (!FILE_MANAGER_ALLOWED_CONTENT_TYPES.some((type) => type === file.type))
    throw new FileError("features.fileManager.errors.unsupported");
  if (!file.size)
    throw new FileError("features.fileManager.errors.invalidMedia");
  if (file.size > 100 * 1024 * 1024)
    throw new FileError("features.fileManager.errors.tooLarge");
  if (
    !accepted.some(
      (type) =>
        type === file.type ||
        (type.endsWith("/*") && file.type.startsWith(type.slice(0, -1))),
    )
  )
    throw new FileError("features.fileManager.errors.unsupported");
  if (!file.type.startsWith("image/")) return;
  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    const cleanup = () => {
      URL.revokeObjectURL(url);
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
    };
    const fail = () => {
      cleanup();
      reject(new FileError("features.fileManager.errors.invalidMedia"));
    };
    const timer = setTimeout(fail, 15_000);
    image.onerror = fail;
    image.onload = () => {
      const pixels = image.naturalWidth * image.naturalHeight;
      cleanup();
      if (!pixels || pixels > 40_000_000)
        reject(new FileError("features.fileManager.errors.imagePixels"));
      else resolve();
    };
    image.src = url;
  });
}
