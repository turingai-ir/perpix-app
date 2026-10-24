import { resolveFileManagerContentTypes } from "../model/content-types";
import { FileManagerError } from "../model/errors";

export async function validateFile(file: File, accepted: readonly string[]) {
  if (!file.size)
    throw new FileManagerError("features.fileManager.errors.invalidMedia");
  if (file.size > 100 * 1024 * 1024)
    throw new FileManagerError("features.fileManager.errors.tooLarge");
  if (
    !resolveFileManagerContentTypes(accepted).some(
      (type) => type === file.type.toLowerCase(),
    )
  ) {
    throw new FileManagerError("features.fileManager.errors.unsupported");
  }
  if (!file.type.startsWith("image/")) return;
  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    const cleanup = () => {
      URL.revokeObjectURL(url);
      image.onload = null;
      image.onerror = null;
      clearTimeout(timer);
    };
    const fail = () => {
      cleanup();
      reject(new FileManagerError("features.fileManager.errors.invalidMedia"));
    };
    const timer = setTimeout(fail, 15_000);
    image.onerror = fail;
    image.onload = () => {
      const pixels = image.naturalWidth * image.naturalHeight;
      cleanup();
      if (!pixels || pixels > 40_000_000)
        reject(new FileManagerError("features.fileManager.errors.imagePixels"));
      else resolve();
    };
    image.src = url;
  });
}
