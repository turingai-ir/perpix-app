/** 2D copy of a WebGL canvas (needs `preserveDrawingBuffer`). */
export function copyCanvas(source: HTMLCanvasElement) {
  const copy = document.createElement("canvas");
  copy.width = source.width;
  copy.height = source.height;
  copy.getContext("2d")?.drawImage(source, 0, 0);
  copy.className = "size-full";
  return copy;
}
