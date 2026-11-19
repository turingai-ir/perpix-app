import { legacyToTemplate } from "./migrate";
import {
  AFTER,
  ALIGNS,
  ANCHORS,
  DECORATION_KINDS,
  DEFAULT_ANIMATOR,
  DEFAULT_DECORATION,
  DEFAULT_TEMPLATE,
  EASES,
  FROM,
  MAX_ANIMATORS,
  MAX_DECORATIONS,
  MAX_ROLES,
  MAX_ROLE_RULES,
  POSITIONS,
  PROPS,
  REVEALS,
  RULE_WHEN,
  SAFE_ZONES,
  SCOPES,
  TRIGGERS,
  WORD_STATES,
  type Animator,
  type CaptionTemplate,
  type Decoration,
  type PropName,
  type Range,
  type RoleRule,
  type RoleStyle,
  type Selector,
  type StateStyle,
  type WordStateName,
} from "./template";
import {
  ROLE_NAME,
  bool,
  color,
  family,
  isRecord,
  num,
  optColor,
  optFamily,
  optNum,
  pick,
  section,
  weight,
  type Raw,
} from "./parse";

const list = (value: unknown, max: number): unknown[] =>
  Array.isArray(value) ? value.slice(0, max) : [];

const roleNames = (value: unknown): string[] =>
  list(value, MAX_ROLES + 1).filter(
    (name): name is string => typeof name === "string" && ROLE_NAME.test(name),
  );

const stateNames = (value: unknown): WordStateName[] =>
  list(value, WORD_STATES.length).filter((name): name is WordStateName =>
    (WORD_STATES as readonly unknown[]).includes(name),
  );

const selector = (value: unknown): Selector => {
  const raw = section(value);
  return {
    scope: pick(raw.scope, SCOPES, "page"),
    roles: roleNames(raw.roles),
    states: stateNames(raw.states),
    position: pick(raw.position, POSITIONS, "any"),
  };
};

const range = (value: unknown, min: number, max: number): Range | null => {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const from = optNum(value[0], min, max);
  const to = optNum(value[1], min, max);
  return from === undefined || to === undefined ? null : [from, to];
};

const PROP_LIMITS: Record<PropName, [number, number]> = {
  opacity: [0, 1],
  scale: [0, 4],
  scaleX: [-4, 4],
  scaleY: [-4, 4],
  x: [-5, 5],
  y: [-5, 5],
  rotate: [-360, 360],
  skewX: [-60, 60],
  blur: [0, 40],
  reveal: [0, 1],
  tint: [0, 1],
  glow: [0, 2],
};

const animator = (value: unknown): Animator => {
  const raw = section(value);
  const d = DEFAULT_ANIMATOR;
  const props: Partial<Record<PropName, Range>> = {};
  const rawProps = section(raw.props);
  for (const name of PROPS) {
    const [min, max] = PROP_LIMITS[name];
    const parsed = range(rawProps[name], min, max);
    if (parsed) props[name] = parsed;
  }
  const jitter = section(raw.jitter);
  return {
    select: selector(raw.select),
    trigger: pick(raw.trigger, TRIGGERS, d.trigger),
    from: pick(raw.from, FROM, d.from),
    durationMs: num(raw.durationMs, d.durationMs, 0, 5000),
    delayMs: num(raw.delayMs, d.delayMs, 0, 5000),
    staggerMs: num(raw.staggerMs, d.staggerMs, 0, 1000),
    ease: pick(raw.ease, EASES, d.ease),
    props,
    jitter: {
      rotate: num(jitter.rotate, 0, 0, 90),
      x: num(jitter.x, 0, 0, 2),
      y: num(jitter.y, 0, 0, 2),
      scale: num(jitter.scale, 0, 0, 1),
    },
    tint: color(raw.tint, d.tint),
    seed: Math.round(num(raw.seed, d.seed, 0, 100000)),
    after: pick(raw.after, AFTER, d.after),
    periodMs: num(raw.periodMs, d.periodMs, 200, 10000),
  };
};

const decoration = (value: unknown): Decoration => {
  const raw = section(value);
  const d = DEFAULT_DECORATION;
  const select = section(raw.select);
  return {
    kind: pick(raw.kind, DECORATION_KINDS, d.kind),
    select: {
      roles: roleNames(select.roles),
      states: "states" in select ? stateNames(select.states) : d.select.states,
    },
    color: color(raw.color, d.color),
    size: num(raw.size, d.size, 0, 80),
    radius: num(raw.radius, d.radius, 0, 80),
    reveal: pick(raw.reveal, REVEALS, d.reveal),
  };
};

const roleStyle = (value: unknown): RoleStyle => {
  const raw = section(value);
  const style: RoleStyle = {};
  const textColor = optColor(raw.color);
  if (textColor) style.color = textColor;
  const scale = optNum(raw.scale, 0.5, 3);
  if (scale !== undefined) style.scale = scale;
  const w = optNum(raw.weight, 100, 900);
  if (w !== undefined) style.weight = Math.round(w / 100) * 100;
  if (typeof raw.italic === "boolean") style.italic = raw.italic;
  const fam = optFamily(raw.family);
  if (fam) style.family = fam;
  if (typeof raw.uppercase === "boolean") style.uppercase = raw.uppercase;
  const strokeColor = optColor(raw.strokeColor);
  if (strokeColor) style.strokeColor = strokeColor;
  const strokeWidth = optNum(raw.strokeWidth, 0, 40);
  if (strokeWidth !== undefined) style.strokeWidth = strokeWidth;
  return style;
};

const stateStyle = (value: unknown): StateStyle => {
  const raw = section(value);
  const style: StateStyle = {};
  const textColor = optColor(raw.color);
  if (textColor) style.color = textColor;
  const opacity = optNum(raw.opacity, 0, 1);
  if (opacity !== undefined) style.opacity = opacity;
  const scale = optNum(raw.scale, 0.5, 3);
  if (scale !== undefined) style.scale = scale;
  const strokeColor = optColor(raw.strokeColor);
  if (strokeColor) style.strokeColor = strokeColor;
  return style;
};

const normalizeV2 = (raw: Raw): CaptionTemplate => {
  const d = DEFAULT_TEMPLATE;
  const base = section(raw.base);
  const font = section(base.font);
  const text = section(base.text);
  const fill = section(base.fill);
  const gradient = section(fill.gradient);
  const stroke = section(base.stroke);
  const shadow = section(base.shadow);
  const layout = section(raw.layout);
  const box = section(raw.box);
  const states = section(raw.states);
  const emoji = section(raw.emoji);

  const roles: Record<string, RoleStyle> = {};
  const rawRoles = section(raw.roles);
  for (const name of Object.keys(rawRoles).slice(0, MAX_ROLES)) {
    if (ROLE_NAME.test(name) && name !== "normal") {
      roles[name] = roleStyle(rawRoles[name]);
    }
  }

  const roleRules: RoleRule[] = list(raw.roleRules, MAX_ROLE_RULES).flatMap(
    (item) => {
      const rule = section(item);
      const when = pick(rule.when, RULE_WHEN, "longest");
      return typeof rule.role === "string" && ROLE_NAME.test(rule.role)
        ? [{ role: rule.role, when }]
        : [];
    },
  );

  const hasList = (key: string) => Array.isArray(raw[key]);
  return {
    version: 2,
    base: {
      font: {
        family: family(font.family, d.base.font.family),
        size: num(font.size, d.base.font.size, 16, 240),
        weight: weight(font.weight, d.base.font.weight),
        italic: bool(font.italic, d.base.font.italic),
      },
      text: {
        uppercase: bool(text.uppercase, d.base.text.uppercase),
        align: pick(text.align, ALIGNS, d.base.text.align),
        lineHeight: num(text.lineHeight, d.base.text.lineHeight, 0.8, 2.5),
        letterSpacing: num(
          text.letterSpacing,
          d.base.text.letterSpacing,
          -5,
          30,
        ),
      },
      fill: {
        color: color(fill.color, d.base.fill.color),
        gradient: {
          enabled: bool(gradient.enabled, d.base.fill.gradient.enabled),
          from: color(gradient.from, d.base.fill.gradient.from),
          to: color(gradient.to, d.base.fill.gradient.to),
        },
      },
      stroke: {
        width: num(stroke.width, d.base.stroke.width, 0, 40),
        color: color(stroke.color, d.base.stroke.color),
      },
      shadow: {
        enabled: bool(shadow.enabled, d.base.shadow.enabled),
        color: color(shadow.color, d.base.shadow.color),
        blur: num(shadow.blur, d.base.shadow.blur, 0, 60),
        offsetX: num(shadow.offsetX, d.base.shadow.offsetX, -60, 60),
        offsetY: num(shadow.offsetY, d.base.shadow.offsetY, -60, 60),
        opacity: num(shadow.opacity, d.base.shadow.opacity, 0, 1),
      },
    },
    layout: {
      anchor: pick(layout.anchor, ANCHORS, d.layout.anchor),
      offset: num(layout.offset, d.layout.offset, 0, 0.45),
      maxWidth: num(layout.maxWidth, d.layout.maxWidth, 0.3, 1),
      wordsPerPage: Math.round(
        num(layout.wordsPerPage, d.layout.wordsPerPage, 1, 12),
      ),
      pauseMs: num(layout.pauseMs, d.layout.pauseMs, 200, 2000),
      safeZone: pick(layout.safeZone, SAFE_ZONES, d.layout.safeZone),
    },
    box: {
      enabled: bool(box.enabled, d.box.enabled),
      color: color(box.color, d.box.color),
      opacity: num(box.opacity, d.box.opacity, 0, 1),
      padding: num(box.padding, d.box.padding, 0, 120),
      radius: num(box.radius, d.box.radius, 0, 120),
    },
    states: {
      upcoming:
        "states" in raw ? stateStyle(states.upcoming) : d.states.upcoming,
      active: "states" in raw ? stateStyle(states.active) : d.states.active,
      spoken: "states" in raw ? stateStyle(states.spoken) : d.states.spoken,
    },
    roles,
    roleRules,
    // A list that is present, even empty, is the author's; only a missing one gets the default.
    animators: hasList("animators")
      ? list(raw.animators, MAX_ANIMATORS).map(animator)
      : d.animators,
    decorations: hasList("decorations")
      ? list(raw.decorations, MAX_DECORATIONS).map(decoration)
      : d.decorations,
    emoji: {
      enabled: bool(emoji.enabled, d.emoji.enabled),
      size: num(emoji.size, d.emoji.size, 0.4, 2),
    },
  };
};

/**
 * Reads a stored config into a complete template. A version 1 config is
 * migrated first. Anything missing, out of range or of an unknown kind falls
 * back to the default, so a preset saved by another version never breaks the
 * renderer and this never throws.
 */
export const normalizeTemplate = (raw: unknown): CaptionTemplate => {
  if (!isRecord(raw)) return DEFAULT_TEMPLATE;
  if (raw.version === 2) return normalizeV2(raw);
  return normalizeV2(legacyToTemplate(raw));
};
