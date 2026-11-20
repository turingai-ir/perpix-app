import { Konva, Layer } from "./konva";
import { CaptionRenderer } from "./renderer";
import type { CaptionTemplate } from "./template";
import type { CaptionWord } from "./words";

/** A detached Konva layer draws the same caption as the editor in a dedicated worker. */
export function offscreenCaptions(
  template: CaptionTemplate,
  words: readonly CaptionWord[],
  width: number,
  height: number,
) {
  Konva.Util.createCanvasElement = () =>
    Object.assign(new OffscreenCanvas(1, 1), { style: {} }) as unknown as HTMLCanvasElement;
  Konva.pixelRatio = 1;
  Konva.autoDrawEnabled = false;
  const layer = new Layer({ listening: false });
  layer.batchDraw = () => layer;
  layer.getCanvas().setSize(width, height);
  const renderer = new CaptionRenderer(layer, template);
  renderer.setWords(words);
  return {
    render(timeMs: number) {
      renderer.render(timeMs, width, height);
      layer.drawScene();
      return layer.getNativeCanvasElement();
    },
    destroy() {
      renderer.destroy();
      layer.destroy();
    },
  };
}
