export interface CropArea {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface CropDisplaySize {
  height: number;
  width: number;
}

export interface CropDisplayOrigin {
  x: number;
  y: number;
}

const ZERO_ORIGIN: CropDisplayOrigin = { x: 0, y: 0 };

export function getCenteredPosition(
  container: CropDisplaySize,
  content: CropDisplaySize,
): CropDisplayOrigin {
  return {
    x: Math.round((container.width - content.width) / 2),
    y: Math.round((container.height - content.height) / 2),
  };
}

export function normalizePosition(
  position: CropDisplayOrigin,
  size: CropDisplaySize,
  origin: CropDisplayOrigin,
): CropDisplayOrigin {
  return {
    x: (position.x - origin.x) / size.width,
    y: (position.y - origin.y) / size.height,
  };
}

export function denormalizePosition(
  position: CropDisplayOrigin,
  size: CropDisplaySize,
  origin: CropDisplayOrigin,
): CropDisplayOrigin {
  return {
    x: Math.round(origin.x + position.x * size.width),
    y: Math.round(origin.y + position.y * size.height),
  };
}

export function normalizeCrop(
  crop: CropArea,
  size: CropDisplaySize,
  origin: CropDisplayOrigin = ZERO_ORIGIN,
): CropArea {
  return {
    height: crop.height / size.height,
    width: crop.width / size.width,
    x: (crop.x - origin.x) / size.width,
    y: (crop.y - origin.y) / size.height,
  };
}

export function denormalizeCrop(
  crop: CropArea,
  size: CropDisplaySize,
  origin: CropDisplayOrigin = ZERO_ORIGIN,
): CropArea {
  return {
    height: Math.round(crop.height * size.height),
    width: Math.round(crop.width * size.width),
    x: Math.round(origin.x + crop.x * size.width),
    y: Math.round(origin.y + crop.y * size.height),
  };
}
