import Konva from "konva";
import {
  emojiState,
  evaluate,
  stateProgress,
  wordStateAt,
  type Unit,
} from "./animators";
import { NORMAL_ROLE, roleOf } from "./roles";
import type { CaptionTemplate, Decoration, RoleStyle } from "./template";
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

/** Free space on a 9:16 frame that social apps cover with their own buttons and text. */
const REELS_SAFE = { top: 0.14, bottom: 0.35, side: 0.06 };

interface DecorationNode {
  decoration: Decoration;
  rect: Konva.Rect | null;
  /** The wipe: the coloured copy of the word, drawn up to `fraction`. */
  overlay: Konva.Text | null;
  setFraction: (fraction: number) => void;
  fullWidth: number;
}

interface PlacedWord {
  word: CaptionWord;
  role: string;
  roleStyle: RoleStyle;
  wrap: Konva.Group;
  base: Konva.Text;
  width: number;
  gradient: boolean;
  decorations: DecorationNode[];
  emoji: Konva.Text | null;
  restX: number;
  index: number;
}

interface PlacedLine {
  group: Konva.Group;
  restY: number;
  index: number;
}

interface Built {
  key: string;
  block: Konva.Group;
  lines: PlacedLine[];
  words: PlacedWord[];
  fontSize: number;
  lineCount: number;
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
  private template: CaptionTemplate;
  private templateKey: string;
  private built: Built | null = null;
  private words: readonly CaptionWord[] = [];

  constructor(
    private readonly layer: Konva.Layer,
    template: CaptionTemplate,
  ) {
    this.template = template;
    this.templateKey = JSON.stringify(template);
    this.layer.add(this.group);
  }

  setTemplate(template: CaptionTemplate) {
    const key = JSON.stringify(template);
    if (key === this.templateKey) return;
    this.template = template;
    this.templateKey = key;
    this.paginate();
    this.dropBuilt();
  }

  setWords(words: readonly CaptionWord[]) {
    this.words = words;
    this.paginate();
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
    const key = `${hit.index}|${width}x${height}|${this.templateKey}`;
    if (!this.built || this.built.key !== key) {
      this.dropBuilt();
      this.built = this.build(hit.page, key, width, height);
      this.group.add(this.built.block);
    }
    this.update(this.built, hit.page, timeMs);
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

  private paginate() {
    const { wordsPerPage, pauseMs } = this.template.layout;
    this.pages = buildPages(this.words, wordsPerPage, pauseMs);
  }

  private dropBuilt() {
    this.built?.block.destroy();
    this.built = null;
  }

  private update(built: Built, page: CaptionPage, timeMs: number) {
    const { template } = this;
    const { fontSize, lineCount } = built;
    const pageUnit: Unit = {
      scope: "page",
      index: 0,
      count: 1,
      role: NORMAL_ROLE,
      seedIndex: 0,
    };
    const block = evaluate(template, pageUnit, page, timeMs);
    built.block.setAttrs({
      x: built.centerX + block.x * fontSize,
      y: built.centerY + block.y * fontSize,
      scaleX: block.scale,
      scaleY: block.scale,
      rotation: block.rotate,
      opacity: block.opacity,
    });

    for (const line of built.lines) {
      const unit: Unit = {
        scope: "line",
        index: line.index,
        count: lineCount,
        role: NORMAL_ROLE,
        seedIndex: line.index,
      };
      const next = evaluate(template, unit, page, timeMs);
      line.group.setAttrs({
        x: next.x * fontSize,
        y: line.restY + next.y * fontSize,
        scaleX: next.scale,
        scaleY: next.scale,
        rotation: next.rotate,
        opacity: next.opacity,
      });
    }

    const { base, states } = template;
    for (const placed of built.words) {
      const unit: Unit = {
        scope: "word",
        index: placed.index,
        count: built.words.length,
        role: placed.role,
        word: placed.word,
        seedIndex: placed.index,
      };
      const state = states[wordStateAt(placed.word, timeMs)];
      const motion = evaluate(template, unit, page, timeMs);
      placed.wrap.setAttrs({
        x: placed.restX + motion.x * fontSize,
        y: motion.y * fontSize,
        scaleX: motion.scale * (state.scale ?? 1),
        scaleY: motion.scale * (state.scale ?? 1),
        rotation: motion.rotate,
        opacity: motion.opacity * (state.opacity ?? 1),
      });
      const colored = state.color ?? placed.roleStyle.color;
      const gradient = placed.gradient && colored === undefined;
      placed.base.fillPriority(gradient ? "linear-gradient" : "color");
      placed.base.fill(colored ?? base.fill.color);
      const strokeColor =
        state.strokeColor ?? placed.roleStyle.strokeColor ?? base.stroke.color;
      placed.base.stroke(strokeColor);

      for (const node of placed.decorations) {
        this.updateDecoration(node, placed, timeMs);
      }
      if (placed.emoji) {
        const emoji = emojiState(placed.word, timeMs);
        placed.emoji.setAttrs({
          opacity: emoji.opacity,
          scaleX: emoji.scale,
          scaleY: emoji.scale,
        });
      }
    }
  }

  private updateDecoration(
    node: DecorationNode,
    placed: PlacedWord,
    timeMs: number,
  ) {
    const { decoration } = node;
    const state = wordStateAt(placed.word, timeMs);
    const on = decoration.select.states.includes(state);
    const progress = on
      ? stateProgress(
          placed.word,
          timeMs,
          decoration.kind === "wipe" ? "wipe" : "quick",
        )
      : 0;
    if (decoration.kind === "wipe") {
      node.setFraction(on ? progress : 0);
      return;
    }
    const rect = node.rect;
    if (!rect) return;
    if (decoration.reveal === "sweep") {
      const rtl = isRtl(placed.word.text);
      const covered = node.fullWidth * progress;
      rect.width(covered);
      rect.offsetX(rtl ? covered - node.fullWidth : 0);
      rect.opacity(on ? 1 : 0);
    } else {
      rect.width(node.fullWidth);
      rect.offsetX(0);
      rect.opacity(on ? progress : 0);
    }
  }

  private build(
    page: CaptionPage,
    key: string,
    width: number,
    height: number,
  ): Built {
    const { template } = this;
    const { base, layout, box, emoji } = template;
    const scale = height / REFERENCE_HEIGHT;
    const fontSize = base.font.size * scale;
    const lineHeight = fontSize * base.text.lineHeight;
    const padding = box.enabled ? box.padding * scale : 0;
    const rtl = page.words.some((word) => isRtl(word.text));
    const stroke = base.stroke.width;

    const placed: PlacedWord[] = page.words.map((word, index) => {
      const role = roleOf(word, page, template);
      const roleStyle: RoleStyle =
        role === NORMAL_ROLE ? {} : (template.roles[role] ?? {});
      const textProps = (): Konva.TextConfig => {
        const italic = roleStyle.italic ?? base.font.italic;
        const weight = roleStyle.weight ?? base.font.weight;
        const upper = roleStyle.uppercase ?? base.text.uppercase;
        return {
          text: upper ? word.text.toUpperCase() : word.text,
          fontFamily: roleStyle.family ?? base.font.family,
          fontStyle: `${italic ? "italic " : ""}${weight}`,
          fontSize: fontSize * (roleStyle.scale ?? 1),
          lineHeight: 1,
          // The page's own direction must not leak into the canvas.
          direction: isRtl(word.text) ? "rtl" : "ltr",
          // Letter spacing would break the joined letters of Arabic script.
          letterSpacing: rtl ? 0 : base.text.letterSpacing * scale,
          wrap: "none",
        };
      };
      const strokeWidth = (roleStyle.strokeWidth ?? stroke) * scale;
      const text = new Konva.Text({
        ...textProps(),
        fill: base.fill.color,
        stroke: strokeWidth > 0 ? base.stroke.color : undefined,
        strokeWidth,
        fillAfterStrokeEnabled: true,
        lineJoin: "round",
        shadowEnabled: base.shadow.enabled,
        shadowColor: base.shadow.color,
        shadowBlur: base.shadow.blur * scale,
        shadowOffset: {
          x: base.shadow.offsetX * scale,
          y: base.shadow.offsetY * scale,
        },
        shadowOpacity: base.shadow.opacity,
        shadowForStrokeEnabled: false,
      });
      const useGradient = base.fill.gradient.enabled;
      if (useGradient) {
        text.setAttrs({
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 0, y: text.height() },
          fillLinearGradientColorStops: [
            0,
            base.fill.gradient.from,
            1,
            base.fill.gradient.to,
          ],
        });
      }
      const wrap = new Konva.Group();
      const w = text.width();
      const h = text.height();

      const decorations: DecorationNode[] = [];
      const behind: Konva.Node[] = [];
      const above: Konva.Node[] = [];
      for (const decoration of template.decorations) {
        const { roles } = decoration.select;
        if (roles.length > 0 && !roles.includes(role)) continue;
        const size = decoration.size * scale;
        const radius = decoration.radius * scale;
        if (decoration.kind === "wipe") {
          const overlay = new Konva.Text({
            ...textProps(),
            fill: decoration.color,
          });
          let fraction = 0;
          const clip = new Konva.Group({
            clipFunc: (context) => {
              const covered = w * fraction;
              context.rect(rtl ? w - covered : 0, 0, covered, h);
            },
          });
          clip.position({ x: -w / 2, y: -h / 2 });
          clip.add(overlay);
          above.push(clip);
          decorations.push({
            decoration,
            rect: null,
            overlay,
            fullWidth: w,
            setFraction: (next) => {
              fraction = next;
            },
          });
          continue;
        }
        let rect: Konva.Rect;
        let fullWidth: number;
        if (decoration.kind === "pill") {
          fullWidth = w + 2 * size;
          rect = new Konva.Rect({
            x: -w / 2 - size,
            y: -h / 2 - size / 2,
            width: fullWidth,
            height: h + size,
            cornerRadius: radius,
            fill: decoration.color,
            opacity: 0,
          });
        } else if (decoration.kind === "marker") {
          fullWidth = w + 0.2 * h;
          rect = new Konva.Rect({
            x: -w / 2 - 0.1 * h,
            y: h * 0.02,
            width: fullWidth,
            height: h * 0.42,
            cornerRadius: radius,
            fill: decoration.color,
            opacity: 0,
          });
        } else {
          const thickness = Math.max(1, size);
          fullWidth = w;
          rect = new Konva.Rect({
            x: -w / 2,
            y: h / 2 + thickness * 0.2,
            width: fullWidth,
            height: thickness,
            cornerRadius: Math.min(radius, thickness / 2),
            fill: decoration.color,
            opacity: 0,
          });
        }
        behind.push(rect);
        decorations.push({
          decoration,
          rect,
          overlay: null,
          fullWidth,
          setFraction: () => undefined,
        });
      }

      text.position({ x: -w / 2, y: -h / 2 });
      for (const node of behind) wrap.add(node as Konva.Rect);
      wrap.add(text);
      for (const node of above) wrap.add(node as Konva.Group);

      let emojiNode: Konva.Text | null = null;
      if (emoji.enabled && word.emoji) {
        emojiNode = new Konva.Text({
          text: word.emoji,
          fontSize: fontSize * emoji.size,
          lineHeight: 1,
          opacity: 0,
        });
        emojiNode.offset({
          x: emojiNode.width() / 2,
          y: emojiNode.height() / 2,
        });
        emojiNode.position({ x: 0, y: -h / 2 - lineHeight * 0.55 });
        wrap.add(emojiNode);
      }
      return {
        word,
        role,
        roleStyle,
        wrap,
        base: text,
        width: w,
        gradient: useGradient,
        decorations,
        emoji: emojiNode,
        restX: 0,
        index,
      };
    });

    // Greedy line breaking on the measured widths.
    const space = fontSize * SPACE_RATIO;
    const sideRoom = layout.safeZone === "reels" ? 1 - 2 * REELS_SAFE.side : 1;
    const limit = width * Math.min(layout.maxWidth, sideRoom) - 2 * padding;
    const rows: PlacedWord[][] = [];
    let row: PlacedWord[] = [];
    let rowWidth = 0;
    for (const item of placed) {
      const next = row.length ? rowWidth + space + item.width : item.width;
      if (row.length && next > limit) {
        rows.push(row);
        row = [];
        rowWidth = 0;
      }
      rowWidth = row.length ? rowWidth + space + item.width : item.width;
      row.push(item);
    }
    if (row.length) rows.push(row);

    const widthOf = (items: PlacedWord[]) =>
      items.reduce((sum, item) => sum + item.width, 0) +
      space * Math.max(0, items.length - 1);
    const blockWidth = Math.max(...rows.map(widthOf), 0);
    const blockHeight = rows.length * lineHeight;
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

    const lines: PlacedLine[] = rows.map((items, index) => {
      const lineGroup = new Konva.Group();
      const free = blockWidth - widthOf(items);
      const shift =
        base.text.align === "center"
          ? free / 2
          : base.text.align === "left"
            ? 0
            : free;
      // Right-to-left text starts at the right edge of the line.
      let cursor = rtl ? blockWidth - shift : shift;
      const restY = -blockHeight / 2 + index * lineHeight + lineHeight / 2;
      for (const item of items) {
        const left = rtl ? cursor - item.width : cursor;
        item.restX = left - blockWidth / 2 + item.width / 2;
        lineGroup.add(item.wrap);
        cursor = rtl
          ? cursor - item.width - space
          : cursor + item.width + space;
      }
      block.add(lineGroup);
      return { group: lineGroup, restY, index };
    });

    const margin = layout.offset * height;
    const halfBox = blockHeight / 2 + padding;
    let centerY =
      layout.anchor === "top"
        ? margin + halfBox
        : layout.anchor === "bottom"
          ? height - margin - halfBox
          : height / 2 + margin;
    if (layout.safeZone === "reels") {
      const low = height * REELS_SAFE.top + halfBox;
      const high = height * (1 - REELS_SAFE.bottom) - halfBox;
      centerY =
        high >= low ? Math.min(high, Math.max(low, centerY)) : (low + high) / 2;
    }
    return {
      key,
      block,
      lines,
      words: placed,
      fontSize,
      lineCount: rows.length,
      centerX: width / 2,
      centerY,
    };
  }
}
