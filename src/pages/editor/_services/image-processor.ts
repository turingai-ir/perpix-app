import Konva from "konva";
import type { FiltersState } from "../_model/types";
import { getPresetFilter } from "./filter-effects";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    if (!src.startsWith("blob:") && !src.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => res(img);
    img.onerror = (e) => rej(new Error(`Failed to load image: ${e}`));
    img.src = src;
  });
}

export async function processImage(
  src: string,
  options: {
    crop?: { x: number; y: number; width: number; height: number };
    resize?: { width: number; height: number };
    filters?: FiltersState;
  },
): Promise<{ src: string; width: number; height: number }> {
  const img = await loadImage(src);
  let cw = img.naturalWidth,
    ch = img.naturalHeight;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (options.crop) {
    cw = options.crop.width;
    ch = options.crop.height;
    canvas.width = cw;
    canvas.height = ch;
    ctx?.drawImage(img, options.crop.x, options.crop.y, cw, ch, 0, 0, cw, ch);
  } else {
    canvas.width = cw;
    canvas.height = ch;
    ctx?.drawImage(img, 0, 0);
  }

  let outSrc = canvas.toDataURL("image/jpeg", 0.9);

  if (options.resize) {
    const { width: rw, height: rh } = options.resize;
    const rc = document.createElement("canvas");
    rc.width = rw;
    rc.height = rh;
    rc.getContext("2d")?.drawImage(await loadImage(outSrc), 0, 0, rw, rh);
    outSrc = rc.toDataURL("image/jpeg", 0.9);
    cw = rw;
    ch = rh;
  }

  if (options.filters) {
    outSrc = await applyFiltersOffscreen(outSrc, cw, ch, options.filters);
  }

  return { src: outSrc, width: cw, height: ch };
}

async function applyFiltersOffscreen(
  src: string,
  width: number,
  height: number,
  filters: FiltersState,
): Promise<string> {
  const img = await loadImage(src);
  const stage = new Konva.Stage({
    width,
    height,
    container: document.createElement("div"),
  });
  const layer = new Konva.Layer();
  const kImg = new Konva.Image({ image: img, width, height });

  const flt: any[] = [];
  if (filters.brightness !== 0) {
    flt.push(Konva.Filters.Brighten);
    kImg.brightness(filters.brightness);
  }
  if (filters.contrast !== 0) {
    flt.push(Konva.Filters.Contrast);
    kImg.contrast(filters.contrast);
  }
  if (filters.blur > 0) {
    flt.push(Konva.Filters.Blur);
    kImg.blurRadius(filters.blur);
  }
  const preset = getPresetFilter(filters.preset);
  if (preset) flt.push(preset);

  if (flt.length) {
    kImg.filters(flt);
    kImg.cache();
  }
  layer.add(kImg);
  stage.add(layer);
  layer.draw();

  const dataUrl = stage.toDataURL({ mimeType: "image/jpeg", quality: 0.9 });
  stage.destroy();
  return dataUrl;
}
