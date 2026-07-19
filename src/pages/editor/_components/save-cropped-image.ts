import type { CropArea } from "../_model/crop-area";

export function saveCroppedImage(
  image: HTMLImageElement,
  appliedCrop: CropArea,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = appliedCrop.width;
  canvas.height = appliedCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");
  ctx.drawImage(
    image,
    appliedCrop.x,
    appliedCrop.y,
    appliedCrop.width,
    appliedCrop.height,
    0,
    0,
    appliedCrop.width,
    appliedCrop.height,
  );
  return canvas.toDataURL("image/png");
}
