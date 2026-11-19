import { Ellipse, Group, Line, Rect, Star, Text, type Node, type Shape, type TextConfig } from "./konva";
import { seeded } from "./animators";
import { withAlpha } from "./colors";
import type { Decoration } from "./template";

/** What a decoration needs to know about the word it belongs to. */
export interface WordGeometry {
  startMs: number;
  /** Width and height of the word's text, in px. */
  w: number;
  h: number;
  rtl: boolean;
  /** Frame height over 1080. */
  scale: number;
  /** Builds the text config of the word, to draw a coloured copy of it. */
  textProps: () => TextConfig;
  /** Whether the word's letters move on their own, which a copy of the word cannot follow. */
  hasChars: boolean;
  seedIndex: number;
}

export interface DecorationInstance {
  /** Under the text, or over it. */
  layer: "behind" | "above";
  node: Node;
  /**
   * Shows the decoration for the moment. `on` says whether the word is in one
   * of the states the decoration was asked for; `progress` is how far the
   * highlight has come, from 0 to 1.
   */
  apply: (on: boolean, progress: number, timeMs: number) => void;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** A rectangle that appears by fading, or grows from the word's first letter. */
const rectInstance = (
  rect: Rect,
  full: number,
  rtl: boolean,
  reveal: Decoration["reveal"],
  layer: "behind" | "above",
): DecorationInstance => ({
  layer,
  node: rect,
  apply: (on, progress) => {
    if (reveal === "sweep") {
      const covered = full * progress;
      rect.width(covered);
      rect.offsetX(rtl ? covered - full : 0);
      rect.opacity(on ? 1 : 0);
    } else {
      rect.width(full);
      rect.offsetX(0);
      rect.opacity(on ? progress : 0);
    }
  },
});

/** An outline that is drawn along its length, or fades in. */
const outlineInstance = (
  shape: Shape,
  length: number,
  reveal: Decoration["reveal"],
): DecorationInstance => {
  shape.dash([length, length]);
  return {
    layer: "behind",
    node: shape,
    apply: (on, progress) => {
      if (reveal === "sweep") {
        shape.dashOffset(length * (1 - progress));
        shape.opacity(on ? 1 : 0);
      } else {
        shape.dashOffset(0);
        shape.opacity(on ? progress : 0);
      }
    },
  };
};

/** Makes the decoration of one word, or nothing if it cannot be drawn for it. */
export const makeDecoration = (
  decoration: Decoration,
  g: WordGeometry,
): DecorationInstance | null => {
  const { w, h, rtl, scale } = g;
  const size = decoration.size * scale;
  const radius = decoration.radius * scale;
  const { color, reveal } = decoration;

  switch (decoration.kind) {
    case "wipe": {
      if (g.hasChars) return null;
      const overlay = new Text({ ...g.textProps(), fill: color });
      let fraction = 0;
      const clip = new Group({
        clipFunc: (context) => {
          const covered = w * fraction;
          context.rect(rtl ? w - covered : 0, 0, covered, h);
        },
      });
      clip.position({ x: -w / 2, y: -h / 2 });
      clip.add(overlay);
      return {
        layer: "above",
        node: clip,
        apply: (on, progress) => {
          fraction = on ? progress : 0;
        },
      };
    }
    case "shine": {
      if (g.hasChars) return null;
      const band = w * 0.6;
      const clear = withAlpha(color, 0);
      const overlay = new Text({
        ...g.textProps(),
        fill: color,
        fillLinearGradientColorStops: [0, clear, 0.5, color, 1, clear],
        fillPriority: "linear-gradient",
        opacity: 0,
      });
      overlay.position({ x: -w / 2, y: -h / 2 });
      return {
        layer: "above",
        node: overlay,
        apply: (on, progress) => {
          const start = rtl
            ? w - progress * (w + band)
            : -band + progress * (w + band);
          overlay.fillLinearGradientStartPoint({ x: start, y: 0 });
          overlay.fillLinearGradientEndPoint({ x: start + band, y: 0 });
          overlay.opacity(on && progress < 1 ? 1 : 0);
        },
      };
    }
    case "pill": {
      const full = w + 2 * size;
      const rect = new Rect({
        x: -w / 2 - size,
        y: -h / 2 - size / 2,
        width: full,
        height: h + size,
        cornerRadius: radius,
        fill: color,
        opacity: 0,
      });
      return rectInstance(rect, full, rtl, reveal, "behind");
    }
    case "marker": {
      const full = w + 0.2 * h;
      const rect = new Rect({
        x: -w / 2 - 0.1 * h,
        y: h * 0.02,
        width: full,
        height: h * 0.42,
        cornerRadius: radius,
        fill: color,
        opacity: 0,
      });
      return rectInstance(rect, full, rtl, reveal, "behind");
    }
    case "underline": {
      const thickness = Math.max(1, size);
      const rect = new Rect({
        x: -w / 2,
        y: h / 2 + thickness * 0.2,
        width: w,
        height: thickness,
        cornerRadius: Math.min(radius, thickness / 2),
        fill: color,
        opacity: 0,
      });
      return rectInstance(rect, w, rtl, reveal, "behind");
    }
    case "strike": {
      const thickness = Math.max(1, size);
      const rect = new Rect({
        x: -w / 2,
        y: h * 0.06 - thickness / 2,
        width: w,
        height: thickness,
        cornerRadius: Math.min(radius, thickness / 2),
        fill: color,
        opacity: 0,
      });
      return rectInstance(rect, w, rtl, reveal, "above");
    }
    case "frame": {
      const padX = 0.18 * h;
      const padY = 0.08 * h;
      const rect = new Rect({
        x: -w / 2 - padX,
        y: -h / 2 - padY,
        width: w + 2 * padX,
        height: h + 2 * padY,
        cornerRadius: radius,
        stroke: color,
        strokeWidth: Math.max(1, size),
        lineJoin: "round",
        opacity: 0,
      });
      return outlineInstance(rect, 2 * (w + h + 2 * padX + 2 * padY), reveal);
    }
    case "circle": {
      const rx = w / 2 + 0.3 * h;
      const ry = h / 2 + 0.12 * h;
      const ellipse = new Ellipse({
        radiusX: rx,
        radiusY: ry,
        rotation: -3,
        stroke: color,
        strokeWidth: Math.max(1, size),
        lineCap: "round",
        opacity: 0,
      });
      // Ramanujan's approximation of an ellipse's perimeter.
      const length =
        Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
      return outlineInstance(ellipse, length, reveal);
    }
    case "squiggle": {
      const thickness = Math.max(1, size);
      const amplitude = Math.max(2, thickness * 0.9);
      const period = Math.max(8 * scale, h * 0.32);
      const step = period / 6;
      const points: number[] = [];
      for (let x = -w / 2; x <= w / 2 + step; x += step) {
        points.push(
          x,
          h / 2 +
            amplitude * 1.4 +
            Math.sin(((x + w / 2) / period) * 2 * Math.PI) * amplitude,
        );
      }
      const line = new Line({
        points,
        stroke: color,
        strokeWidth: thickness,
        lineCap: "round",
        lineJoin: "round",
        tension: 0.4,
      });
      let covered = 1;
      const group = new Group({
        opacity: 0,
        clipFunc: (context) => {
          const span = (w + 2 * amplitude) * covered;
          context.rect(
            rtl ? w / 2 + amplitude - span : -w / 2 - amplitude,
            -h,
            span,
            3 * h,
          );
        },
      });
      group.add(line);
      return {
        layer: "behind",
        node: group,
        apply: (on, progress) => {
          covered = reveal === "sweep" ? progress : 1;
          group.opacity(on ? (reveal === "sweep" ? 1 : progress) : 0);
        },
      };
    }
    case "sparkle": {
      const count = Math.max(1, Math.round(decoration.count));
      const group = new Group({ opacity: 1 });
      const stars: Star[] = [];
      const seed = g.seedIndex * 13 + 5;
      for (let i = 0; i < count; i++) {
        const outer = h * (0.1 + 0.1 * (seeded(seed, i, 3) * 0.5 + 0.5));
        const star = new Star({
          x: seeded(seed, i, 1) * (w / 2 + 0.3 * h),
          y: seeded(seed, i, 2) * h * 0.85,
          numPoints: 4,
          innerRadius: outer * 0.3,
          outerRadius: outer,
          fill: color,
          opacity: 0,
        });
        stars.push(star);
        group.add(star);
      }
      return {
        layer: "above",
        node: group,
        apply: (on, _progress, timeMs) => {
          stars.forEach((star, i) => {
            const life = clamp01((timeMs - g.startMs - i * 45) / 650);
            const visible = on && life > 0 && life < 1;
            star.opacity(visible ? 1 : 0);
            star.scale({
              x: Math.sin(Math.PI * life),
              y: Math.sin(Math.PI * life),
            });
            star.rotation(life * 120);
          });
        },
      };
    }
    case "progress":
      return null;
  }
};
