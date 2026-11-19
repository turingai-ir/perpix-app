import { Blur, Group, Konva, Layer, Node, Rect, Text, type TextConfig } from "./konva";
import {
  combine,
  emojiState,
  evaluate,
  stateProgress,
  wordStateAt,
  type Transform,
  type Unit,
} from "./animators";
import { mixColors } from "./colors";
import { makeDecoration, type DecorationInstance } from "./decorations";
import { NORMAL_ROLE, roleOf } from "./roles";
import type {
  CaptionTemplate,
  Decoration,
  RoleStyle,
  WordStateName,
} from "./template";
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

/** The letters of a word as the user sees them (a letter with its marks is one). */
interface SegmenterLike {
  segment(text: string): Iterable<{ segment: string }>;
}

const makeSegmenter = (): SegmenterLike | null => {
  const ctor = (
    Intl as unknown as {
      Segmenter?: new (
        locale?: string,
        options?: { granularity: "grapheme" },
      ) => SegmenterLike;
    }
  ).Segmenter;
  return ctor ? new ctor(undefined, { granularity: "grapheme" }) : null;
};

const splitLetters = (text: string): string[] => {
  const segmenter = makeSegmenter();
  return segmenter
    ? Array.from(segmenter.segment(text), (part) => part.segment)
    : Array.from(text);
};

/** Free space on a 9:16 frame that social apps cover with their own buttons and text. */
const REELS_SAFE = { top: 0.14, bottom: 0.35, side: 0.06 };

interface PlacedChar {
  group: Group;
  text: Text;
  restX: number;
  width: number;
}

interface PlacedWord {
  word: CaptionWord;
  role: string;
  roleStyle: RoleStyle;
  wrap: Group;
  /** One text for the word, or one per letter when letters are animated. */
  texts: Text[];
  chars: PlacedChar[];
  height: number;
  margin: number;
  /** How much of the word is uncovered; read by the clip. */
  reveal: { value: number };
  /** Where a cached (blurred) word is drawn from, in its own space. */
  bounds: Bounds;
  width: number;
  gradient: boolean;
  decorations: Array<{ decoration: Decoration; item: DecorationInstance }>;
  emoji: Text | null;
  restX: number;
  index: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PlacedLine {
  group: Group;
  restY: number;
  index: number;
  bounds: Bounds;
}

interface Built {
  key: string;
  block: Group;
  lines: PlacedLine[];
  words: PlacedWord[];
  fontSize: number;
  lineCount: number;
  scale: number;
  centerX: number;
  centerY: number;
  blockBounds: Bounds;
  bars: Array<{ rect: Rect; full: number; rtl: boolean }>;
}

/**
 * Draws a caption into a Konva layer, for any moment of the file. `render` is a
 * function of the time it is given and nothing else, so scrubbing, playing and
 * exporting frame by frame all show the same picture.
 */
export class CaptionRenderer {
  private readonly group = new Group();
  private pages: CaptionPage[] = [];
  private template: CaptionTemplate;
  private templateKey: string;
  private built: Built | null = null;
  private words: readonly CaptionWord[] = [];

  constructor(
    private readonly layer: Layer,
    template: CaptionTemplate,
  ) {
    this.template = template;
    this.templateKey = JSON.stringify(template);
    this.layer.add(this.group);
  }

  setTemplate(template: CaptionTemplate) {
    if (template === this.template) return;
    const key = JSON.stringify(template);
    if (key === this.templateKey) return;
    this.template = template;
    this.templateKey = key;
    this.paginate();
    this.dropBuilt();
  }

  setWords(words: readonly CaptionWord[]) {
    if (words === this.words) return;
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
    const { fontSize, lineCount, scale } = built;
    const hasChars = template.animators.some((a) => a.select.scope === "char");
    const pageUnit: Unit = {
      scope: "page",
      index: 0,
      count: 1,
      role: NORMAL_ROLE,
      seedIndex: 0,
    };
    const block = evaluate(template, pageUnit, page, timeMs);
    const blurred: Array<{ node: Node; bounds: Bounds; radius: number }> =
      [];
    const place = (
      node: Node,
      restX: number,
      restY: number,
      tr: Transform,
      bounds: Bounds,
    ) => {
      node.setAttrs({
        x: restX + tr.x * fontSize,
        y: restY + tr.y * fontSize,
        scaleX: tr.scale * tr.scaleX,
        scaleY: tr.scale * tr.scaleY,
        rotation: tr.rotate,
        skewX: Math.tan((tr.skewX * Math.PI) / 180),
        opacity: tr.opacity,
      });
      if (tr.blur > 0.3)
        blurred.push({ node, bounds, radius: tr.blur * scale });
      else if (node.isCached()) node.clearCache();
    };

    place(built.block, built.centerX, built.centerY, block, built.blockBounds);
    const span = Math.max(1, page.endMs - page.startMs);
    for (const bar of built.bars) {
      const covered =
        bar.full * Math.min(1, Math.max(0, (timeMs - page.startMs) / span));
      bar.rect.width(covered);
      bar.rect.offsetX(bar.rtl ? covered - bar.full : 0);
    }

    for (const line of built.lines) {
      const unit: Unit = {
        scope: "line",
        index: line.index,
        count: lineCount,
        role: NORMAL_ROLE,
        seedIndex: line.index,
      };
      place(
        line.group,
        0,
        line.restY,
        evaluate(template, unit, page, timeMs),
        line.bounds,
      );
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
      // A word with letters that are not animated separately gets the letter
      // animators as a whole, so a template still plays on Persian words.
      const whole =
        hasChars && placed.chars.length === 0
          ? combine(
              motion,
              evaluate(
                template,
                { ...unit, scope: "char", index: 0, count: 1 },
                page,
                timeMs,
              ),
            )
          : motion;
      const stateScale = state.scale ?? 1;
      place(
        placed.wrap,
        placed.restX,
        0,
        {
          ...whole,
          scale: whole.scale * stateScale,
          opacity: whole.opacity * (state.opacity ?? 1),
        },
        placed.bounds,
      );
      placed.reveal.value = whole.reveal;

      const palette = base.fill.palette;
      const colored =
        state.color ??
        placed.roleStyle.color ??
        (palette.length > 0
          ? palette[placed.index % palette.length]
          : undefined);
      const gradient = placed.gradient && colored === undefined;
      const rest = colored ?? base.fill.color;
      const strokeColor =
        state.strokeColor ?? placed.roleStyle.strokeColor ?? base.stroke.color;
      const paint = (text: Text, tr: Transform) => {
        const mixed =
          tr.tint > 0 ? mixColors(rest, tr.tintColor, tr.tint) : rest;
        text.fillPriority(
          gradient && tr.tint === 0 ? "linear-gradient" : "color",
        );
        text.fill(mixed);
        text.stroke(strokeColor);
        if (tr.glow > 0) {
          text.setAttrs({
            shadowEnabled: true,
            shadowColor: tr.tintColor,
            shadowBlur: tr.glow * 30 * scale,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 1,
          });
        } else {
          text.setAttrs({
            shadowEnabled: base.shadow.enabled,
            shadowColor: base.shadow.color,
            shadowBlur: base.shadow.blur * scale,
            shadowOffset: {
              x: base.shadow.offsetX * scale,
              y: base.shadow.offsetY * scale,
            },
            shadowOpacity: base.shadow.opacity,
          });
        }
      };

      if (placed.chars.length > 0) {
        placed.chars.forEach((char, i) => {
          const charUnit: Unit = {
            scope: "char",
            index: i,
            count: placed.chars.length,
            role: placed.role,
            word: placed.word,
            seedIndex: placed.index * 64 + i,
          };
          const letter = evaluate(template, charUnit, page, timeMs);
          paint(char.text, combine(whole, letter));
          place(char.group, char.restX, 0, letter, {
            x: -char.width / 2 - placed.margin,
            y: -placed.height / 2 - placed.margin,
            width: char.width + 2 * placed.margin,
            height: placed.height + 2 * placed.margin,
          });
        });
      } else {
        for (const text of placed.texts) paint(text, whole);
      }

      for (const { decoration, item } of placed.decorations) {
        this.updateDecoration(
          item,
          decoration.kind,
          decoration.select.states,
          placed,
          timeMs,
        );
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

    // A cache is a picture of what is inside it, so blur is applied last, from
    // the inside out, once every colour and position is final.
    for (const { node, bounds, radius } of blurred.reverse()) {
      node.cache({ ...bounds, pixelRatio: Konva.pixelRatio });
      node.filters([Blur]);
      node.blurRadius(radius);
    }
  }

  private updateDecoration(
    item: DecorationInstance,
    kind: Decoration["kind"],
    states: readonly WordStateName[],
    placed: PlacedWord,
    timeMs: number,
  ) {
    const on = states.includes(wordStateAt(placed.word, timeMs));
    const sweepsWord = kind === "wipe" || kind === "shine";
    const progress = on
      ? stateProgress(placed.word, timeMs, sweepsWord ? "wipe" : "quick")
      : 0;
    item.apply(on, progress, timeMs);
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

    const hasChars = template.animators.some((x) => x.select.scope === "char");
    const margin = 60 * scale;
    const placed: PlacedWord[] = page.words.map((word, index) => {
      const role = roleOf(word, page, template);
      const roleStyle: RoleStyle =
        role === NORMAL_ROLE ? {} : (template.roles[role] ?? {});
      const wordRtl = isRtl(word.text);
      const textProps = (content: string): TextConfig => {
        const italic = roleStyle.italic ?? base.font.italic;
        const weight = roleStyle.weight ?? base.font.weight;
        const upper = roleStyle.uppercase ?? base.text.uppercase;
        return {
          text: upper ? content.toUpperCase() : content,
          fontFamily: roleStyle.family ?? base.font.family,
          fontStyle: `${italic ? "italic " : ""}${weight}`,
          fontSize: fontSize * (roleStyle.scale ?? 1),
          lineHeight: 1,
          // The page's own direction must not leak into the canvas.
          direction: wordRtl ? "rtl" : "ltr",
          // Letter spacing would break the joined letters of Arabic script.
          letterSpacing: rtl ? 0 : base.text.letterSpacing * scale,
          wrap: "none",
        };
      };
      const strokeWidth = (roleStyle.strokeWidth ?? stroke) * scale;
      const gradientOn = base.fill.gradient.enabled;
      const makeText = (content: string) => {
        const text = new Text({
          ...textProps(content),
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
        if (gradientOn) {
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
        return text;
      };

      const wrap = new Group();
      const texts: Text[] = [];
      const chars: PlacedChar[] = [];
      let w: number;
      let h: number;
      if (hasChars && !wordRtl) {
        // Letters are placed one by one, which is safe for scripts whose
        // letters do not join.
        const pieces = splitLetters(word.text).map((piece) => makeText(piece));
        w = pieces.reduce((sum, piece) => sum + piece.width(), 0);
        h = pieces[0]?.height() ?? fontSize;
        let cursor = -w / 2;
        for (const piece of pieces) {
          const cw = piece.width();
          const group = new Group();
          piece.position({ x: -cw / 2, y: -h / 2 });
          group.add(piece);
          chars.push({ group, text: piece, restX: cursor + cw / 2, width: cw });
          texts.push(piece);
          cursor += cw;
        }
      } else {
        const text = makeText(word.text);
        w = text.width();
        h = text.height();
        text.position({ x: -w / 2, y: -h / 2 });
        texts.push(text);
      }

      const decorations: PlacedWord["decorations"] = [];
      for (const decoration of template.decorations) {
        const { roles } = decoration.select;
        if (roles.length > 0 && !roles.includes(role)) continue;
        const made = makeDecoration(decoration, {
          startMs: word.startMs,
          w,
          h,
          rtl,
          scale,
          textProps: () => textProps(word.text),
          hasChars: chars.length > 0,
          seedIndex: index,
        });
        if (made) decorations.push({ decoration, item: made });
      }

      for (const { item } of decorations) {
        if (item.layer === "behind") wrap.add(item.node as Group);
      }
      if (chars.length > 0) for (const char of chars) wrap.add(char.group);
      else for (const text of texts) wrap.add(text);
      for (const { item } of decorations) {
        if (item.layer === "above") wrap.add(item.node as Group);
      }

      let emojiNode: Text | null = null;
      if (emoji.enabled && word.emoji) {
        emojiNode = new Text({
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

      // Uncovers the word from its first letter; wide open when fully shown.
      const reveal = { value: 1 };
      const room = margin + 40 * scale;
      wrap.clipFunc((context) => {
        if (reveal.value >= 1) {
          context.rect(
            -w / 2 - room,
            -h / 2 - room - lineHeight,
            w + 2 * room,
            h + 2 * room + lineHeight,
          );
          return;
        }
        const covered = w * Math.max(0, reveal.value);
        context.rect(
          wordRtl ? w / 2 - covered : -w / 2,
          -h / 2 - room - lineHeight,
          covered,
          h + 2 * room + lineHeight,
        );
      });

      return {
        word,
        role,
        roleStyle,
        wrap,
        texts,
        chars,
        height: h,
        reveal,
        margin,
        bounds: {
          x: -w / 2 - margin,
          y: -h / 2 - margin,
          width: w + 2 * margin,
          height: h + 2 * margin,
        },
        width: w,
        gradient: gradientOn,
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
    const block = new Group();

    if (box.enabled) {
      block.add(
        new Rect({
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

    // A bar under the caption that fills as the page goes by.
    const bars: Built["bars"] = template.decorations
      .filter((decoration) => decoration.kind === "progress")
      .map((decoration) => {
        const full = blockWidth + 2 * padding;
        const rect = new Rect({
          x: -full / 2,
          y: blockHeight / 2 + padding + 14 * scale,
          width: 0,
          height: Math.max(2, decoration.size * scale),
          cornerRadius: decoration.radius * scale,
          fill: decoration.color,
        });
        block.add(rect);
        return { rect, full, rtl };
      });

    const lines: PlacedLine[] = rows.map((items, index) => {
      const lineGroup = new Group();
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
      const lineWidth = widthOf(items);
      return {
        group: lineGroup,
        restY,
        index,
        bounds: {
          x: -blockWidth / 2 - margin,
          y: -lineHeight / 2 - margin,
          width: Math.max(blockWidth, lineWidth) + 2 * margin,
          height: lineHeight + 2 * margin,
        },
      };
    });

    const edge = layout.offset * height;
    const halfBox = blockHeight / 2 + padding;
    let centerY =
      layout.anchor === "top"
        ? edge + halfBox
        : layout.anchor === "bottom"
          ? height - edge - halfBox
          : height / 2 + edge;
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
      bars,
      scale,
      blockBounds: {
        x: -blockWidth / 2 - padding - margin,
        y: -halfBox - margin,
        width: blockWidth + 2 * padding + 2 * margin,
        height: 2 * halfBox + 2 * margin,
      },
    };
  }
}
