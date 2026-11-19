import { useEffect, useRef } from "react";
import Konva from "konva";
import { ensureCaptionFont } from "./fonts";
import { CaptionRenderer } from "./renderer";
import type { CaptionTemplate } from "./template";
import type { CaptionWord } from "./words";

interface CaptionPreviewProps {
  template: CaptionTemplate;
  words: readonly CaptionWord[];
  timeMs: number;
  /** Pixel size of the frame; the look scales with its height. */
  width: number;
  height: number;
  /** Painted behind the caption so a light or dark look can be judged. */
  background?: string;
  className?: string;
}

/** The caption at one moment, drawn with the same renderer the export uses. */
export function CaptionPreview({
  template,
  words,
  timeMs,
  width,
  height,
  background = "#1f2937",
  className,
}: CaptionPreviewProps) {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<CaptionRenderer | null>(null);
  const stage = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const created = new Konva.Stage({ container: element, width, height });
    const layer = new Konva.Layer();
    created.add(layer);
    layer.add(
      new Konva.Rect({ width, height, fill: background, listening: false }),
    );
    stage.current = created;
    renderer.current = new CaptionRenderer(layer, template);
    return () => {
      renderer.current?.destroy();
      created.destroy();
      renderer.current = null;
      stage.current = null;
    };
    // The stage is rebuilt only when its size or backdrop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, background]);

  useEffect(() => {
    let cancelled = false;
    void ensureCaptionFont(template).then(() => {
      if (cancelled) return;
      // A font that arrives late changes every measurement.
      renderer.current?.invalidate();
      renderer.current?.render(timeMs, width, height);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    template.base.font.family,
    template.base.font.weight,
    template.base.font.italic,
  ]);

  useEffect(() => {
    renderer.current?.setTemplate(template);
    renderer.current?.setWords(words);
    renderer.current?.render(timeMs, width, height);
  }, [template, words, timeMs, width, height, background]);

  return <div ref={host} className={className} style={{ width, height }} />;
}
