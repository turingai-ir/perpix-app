import Konva from "konva";
import { blockState, emojiState, wordState } from "./animation";
import { isEmphasized } from "./emphasis";
import type { CaptionConfig } from "./config";
import {
  buildPages,
  isRtl,
  pageAt,
  type CaptionPage,
  type CaptionWord,
} from "./words";

/** Frames are laid out for this height; real sizes scale from it. */
const REFERENCE_HEIGHT = 1080;
const SPACE_RATIO = 0.28;

interface PlacedWord {
  word: CaptionWord;
  wrap: Konva.Group;
  base: Konva.Text;
  overlay: Konva.Text | null;
  width: number;
  /** The colour at rest: the text colour, or the key-word colour. */
  rest: string;
  gradient: boolean;
  pill: Konva.Rect | null;
  emoji: Konva.Text | null;
  restY: number;
  lineHeight: number;
  /** Reads the wipe progress the clip is drawn with. */
  setWipe: (fraction: number) => void;
}

interface Built {
  key: string;
  block: Konva.Group;
  words: PlacedWord[];
  /** Where the block's centre is, in frame pixels. */
  centerX: number;
  centerY: number;
}

/**
 * Draws a caption into a Konva layer, for any moment of the file. `render` is a
 * function of the time it is given and nothing else, so scrubbing, playing and
 * exporting frame by frame all show the same picture.
 */
export class CaptionRenderer {
  private readonly group = new Konva.Group();
  private pages: CaptionPage[] = [];
  private config: CaptionConfig;
  private configKey: string;
  private built: Built | null = null;
  private words: readonly CaptionWord[] = [];

  constructor(
    private readonly layer: Konva.Layer,
    config: CaptionConfig,
  ) {
    this.config = config;
    this.configKey = JSON.stringify(config);
    this.layer.add(this.group);
  }

  setConfig(config: CaptionConfig) {
    const key = JSON.stringify(config);
    if (key === this.configKey) return;
    this.config = config;
    this.configKey = key;
    this.pages = buildPages(this.words, config.text.wordsPerPage);
    this.dropBuilt();
  }

  setWords(words: readonly CaptionWord[]) {
    this.words = words;
    this.pages = buildPages(words, this.config.text.wordsPerPage);
    this.dropBuilt();
  }

  /** Puts the caption of `timeMs` on the layer, which is `width` by `height` pixels. */
  render(timeMs: number, width: number, height: number) {
    const hit = pageAt(this.pages, timeMs);
    if (!hit) {
      this.group.visible(false);
      this.layer.batchDraw();
      return;
    }
    const key = `${hit.index}|${width}x${height}|${this.configKey}`;
    if (!this.built || this.built.key !== key) {
      this.dropBuilt();
      this.built = this.build(hit.page, key, width, height);
      this.group.add(this.built.block);
    }
    const { block, words, centerX, centerY } = this.built;
    const state = blockState(this.config, hit.page, timeMs);
    block.setAttrs({
      x: centerX,
      y: centerY + state.dy * height,
      scaleX: state.scale,
      scaleY: state.scale,
      opacity: state.opacity,
    });
    const { colors } = this.config;
    for (const placed of words) {
      const next = wordState(this.config, placed.word, timeMs);
      placed.wrap.setAttrs({
        y: placed.restY + next.dy * placed.lineHeight,
        scaleX: next.scale,
        scaleY: next.scale,
        opacity: next.opacity,
      });
      const useGradient = placed.gradient && !next.active;
      placed.base.fillPriority(useGradient ? "linear-gradient" : "color");
      placed.base.fill(next.active ? colors.active : placed.rest);
      placed.setWipe(next.wipe);
      placed.pill?.opacity(next.pill);
      if (placed.emoji) {
        const emoji = emojiState(placed.word, timeMs);
        placed.emoji.setAttrs({
          opacity: emoji.opacity,
          scaleX: emoji.scale,
          scaleY: emoji.scale,
        });
      }
    }
    this.group.visible(true);
    this.layer.batchDraw();
  }

  /** Forgets the laid-out words, for when something they depend on (a font) changed. */
  invalidate() {
    this.dropBuilt();
  }

  destroy() {
    this.group.destroy();
    this.built = null;
  }

  private dropBuilt() {
    this.built?.block.destroy();
    this.built = null;
  }

  private build(
    page: CaptionPage,
    key: string,
    width: number,
    height: number,
  ): Built {
    const { font, text, layout, colors, box, shadow, strokeWidth } =
      this.config;
    const scale = height / REFERENCE_HEIGHT;
    const fontSize = font.size * scale;
    const lineHeight = fontSize * text.lineHeight;
    const padding = box.enabled ? box.padding * scale : 0;
    const rtl = page.words.some((word) => isRtl(word.text));
    const fontStyle = `${font.italic ? "italic " : ""}${font.weight}`;
    const stroke = strokeWidth * scale;

    const { emphasis, gradient, highlight, emoji } = this.config;
    const textProps = (content: string, key: boolean): Konva.TextConfig => ({
      text:
        text.uppercase || (key && emphasis.uppercase)
          ? content.toUpperCase()
          : content,
      fontFamily: key && emphasis.family ? emphasis.family : font.family,
      fontStyle: key
        ? `${emphasis.italic ? "italic " : ""}${emphasis.weight}`
        : fontStyle,
      fontSize: key ? fontSize * emphasis.scale : fontSize,
      lineHeight: 1,
      // Letter spacing would break the joined letters of Arabic script.
      letterSpacing: rtl ? 0 : text.letterSpacing * scale,
      wrap: "none",
    });

    const placed: PlacedWord[] = page.words.map((word) => {
      const key = isEmphasized(word, page, this.config);
      const rest = key ? emphasis.color : colors.text;
      const base = new Konva.Text({
        ...textProps(word.text, key),
        fill: rest,
        stroke: stroke > 0 ? colors.stroke : undefined,
        strokeWidth: stroke,
        fillAfterStrokeEnabled: true,
        lineJoin: "round",
        shadowEnabled: shadow.enabled,
        shadowColor: shadow.color,
        shadowBlur: shadow.blur * scale,
        shadowOffset: { x: shadow.offsetX * scale, y: shadow.offsetY * scale },
        shadowOpacity: shadow.opacity,
        shadowForStrokeEnabled: false,
      });
      const useGradient = gradient.enabled && !key;
      if (useGradient) {
        base.setAttrs({
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 0, y: base.height() },
          fillLinearGradientColorStops: [0, gradient.from, 1, gradient.to],
          fillPriority: "linear-gradient",
        });
      }
      const wrap = new Konva.Group();
      let pill: Konva.Rect | null = null;
      if (this.config.animation.wordEffect === "box") {
        const pad = highlight.padding * scale;
        pill = new Konva.Rect({
          x: -pad,
          y: -pad / 2,
          width: base.width() + 2 * pad,
          height: base.height() + pad,
          cornerRadius: highlight.radius * scale,
          fill: highlight.color,
          opacity: 0,
        });
        wrap.add(pill);
      }
      wrap.add(base);
      let overlay: Konva.Text | null = null;
      let setWipe = (fraction: number) => void fraction;
      if (this.config.animation.wordEffect === "wipe") {
        overlay = new Konva.Text({
          ...textProps(word.text, key),
          fill: colors.active,
        });
        let fraction = 0;
        const clip = new Konva.Group({
          clipFunc: (context) => {
            const w = base.width();
            const h = base.height();
            const covered = w * fraction;
            context.rect(rtl ? w - covered : 0, 0, covered, h);
          },
        });
        clip.add(overlay);
        wrap.add(clip);
        setWipe = (next: number) => {
          fraction = next;
        };
      }
      let emojiNode: Konva.Text | null = null;
      if (emoji.enabled && word.emoji) {
        emojiNode = new Konva.Text({
          text: word.emoji,
          fontSize: fontSize * emoji.size,
          lineHeight: 1,
          opacity: 0,
        });
        wrap.add(emojiNode);
      }
      return {
        word,
        wrap,
        base,
        overlay,
        width: base.width(),
        rest,
        gradient: useGradient,
        pill,
        emoji: emojiNode,
        restY: 0,
        lineHeight,
        setWipe,
      };
    });

    // Greedy line breaking on the measured widths.
    const space = fontSize * SPACE_RATIO;
    const limit = width * layout.maxWidth - 2 * padding;
    const lines: PlacedWord[][] = [];
    let line: PlacedWord[] = [];
    let lineWidth = 0;
    for (const item of placed) {
      const next = line.length ? lineWidth + space + item.width : item.width;
      if (line.length && next > limit) {
        lines.push(line);
        line = [];
        lineWidth = 0;
      }
      lineWidth = line.length ? lineWidth + space + item.width : item.width;
      line.push(item);
    }
    if (line.length) lines.push(line);

    const widthOf = (items: PlacedWord[]) =>
      items.reduce((sum, item) => sum + item.width, 0) +
      space * Math.max(0, items.length - 1);
    const blockWidth = Math.max(...lines.map(widthOf), 0);
    const blockHeight = lines.length * lineHeight;
    const block = new Konva.Group();

    if (box.enabled) {
      block.add(
        new Konva.Rect({
          x: -blockWidth / 2 - padding,
          y: -blockHeight / 2 - padding,
          width: blockWidth + 2 * padding,
          height: blockHeight + 2 * padding,
          cornerRadius: box.radius * scale,
          fill: box.color,
          opacity: box.opacity,
        }),
      );
    }

    lines.forEach((items, row) => {
      const lw = widthOf(items);
      const free = blockWidth - lw;
      const shift =
        text.align === "center" ? free / 2 : text.align === "left" ? 0 : free;
      // Right-to-left text starts at the right edge of the line.
      let cursor = rtl ? blockWidth - shift : shift;
      const y = -blockHeight / 2 + row * lineHeight + lineHeight / 2;
      for (const item of items) {
        const left = rtl ? cursor - item.width : cursor;
        const cx = left - blockWidth / 2 + item.width / 2;
        const h = item.base.height();
        item.base.position({ x: -item.width / 2, y: -h / 2 });
        item.pill?.position({
          x: -item.width / 2 - highlight.padding * scale,
          y: -h / 2 - (highlight.padding * scale) / 2,
        });
        if (item.emoji) {
          const { emoji: node } = item;
          // Scaling happens around the emoji's own centre.
          node.offset({ x: node.width() / 2, y: node.height() / 2 });
          node.position({ x: 0, y: -h / 2 - lineHeight * 0.55 });
        }
        item.restY = y;
        // The clip group holds the overlay at its own origin, so the clip
        // rectangle is measured from the word's top-left corner.
        item.overlay?.getParent()?.position({ x: -item.width / 2, y: -h / 2 });
        item.wrap.position({ x: cx, y });
        block.add(item.wrap);
        cursor = rtl
          ? cursor - item.width - space
          : cursor + item.width + space;
      }
    });

    const middle = height / 2;
    const margin = layout.offset * height;
    const centerY =
      layout.anchor === "top"
        ? margin + blockHeight / 2 + padding
        : layout.anchor === "bottom"
          ? height - margin - blockHeight / 2 - padding
          : middle + margin;
    return { key, block, words: placed, centerX: width / 2, centerY };
  }
}
