import { describe, expect, it } from "vitest";
import {
  DEFAULT_ANIMATOR,
  evaluate,
  matches,
  normalizeTemplate,
  roleOf,
  seeded,
  wordStateAt,
  type Unit,
} from "../index";
import type { CaptionPage, CaptionWord } from "../words";

const word = (
  text: string,
  startMs: number,
  endMs: number,
  extra: Partial<CaptionWord> = {},
): CaptionWord => ({
  text,
  startMs,
  endMs,
  ...extra,
});

const words = [
  word("one", 0, 400),
  word("twenty", 500, 900),
  word("3", 1000, 1400),
];
const page: CaptionPage = { words, startMs: 0, endMs: 1500 };

const wordUnit = (index: number, role = "normal"): Unit => ({
  scope: "word",
  index,
  count: 3,
  role,
  word: words[index],
  seedIndex: index,
});

const only = (animator: Record<string, unknown>) =>
  normalizeTemplate({ version: 2, animators: [animator] });

describe("wordStateAt", () => {
  it("is upcoming, active, then spoken", () => {
    const w = word("a", 100, 200);
    expect([50, 100, 199, 200].map((t) => wordStateAt(w, t))).toEqual([
      "upcoming",
      "active",
      "active",
      "spoken",
    ]);
  });
});

describe("matches", () => {
  const select = { ...DEFAULT_ANIMATOR.select, scope: "word" as const };
  it("filters by role, state and position", () => {
    expect(matches({ ...select, roles: ["key"] }, wordUnit(0), 0)).toBe(false);
    expect(matches({ ...select, roles: ["key"] }, wordUnit(0, "key"), 0)).toBe(
      true,
    );
    expect(matches({ ...select, states: ["active"] }, wordUnit(0), 100)).toBe(
      true,
    );
    expect(matches({ ...select, states: ["active"] }, wordUnit(0), 450)).toBe(
      false,
    );
    expect(matches({ ...select, position: "last" }, wordUnit(2), 0)).toBe(true);
    expect(matches({ ...select, position: "odd" }, wordUnit(1), 0)).toBe(false);
    expect(matches({ ...select, position: "even" }, wordUnit(1), 0)).toBe(true);
  });
  it("does not match another scope", () => {
    expect(matches({ ...select, scope: "line" }, wordUnit(0), 0)).toBe(false);
  });
});

describe("evaluate", () => {
  it("enter holds the from value, then eases to the to value", () => {
    const t = only({
      select: { scope: "word" },
      trigger: "enter",
      durationMs: 100,
      ease: "linear",
      props: { opacity: [0, 1] },
    });
    expect(evaluate(t, wordUnit(0), page, 0).opacity).toBe(0);
    expect(evaluate(t, wordUnit(0), page, 50).opacity).toBeCloseTo(0.5);
    expect(evaluate(t, wordUnit(0), page, 900).opacity).toBe(1);
  });

  it("enter can start at the word instead of the page", () => {
    const t = only({
      select: { scope: "word" },
      trigger: "enter",
      from: "word",
      durationMs: 100,
      ease: "linear",
      props: { opacity: [0, 1] },
    });
    expect(evaluate(t, wordUnit(1), page, 400).opacity).toBe(0);
    expect(evaluate(t, wordUnit(1), page, 600).opacity).toBe(1);
  });

  it("staggers by position", () => {
    const t = only({
      select: { scope: "word" },
      trigger: "enter",
      durationMs: 100,
      staggerMs: 200,
      ease: "linear",
      props: { opacity: [0, 1] },
    });
    expect(evaluate(t, wordUnit(0), page, 100).opacity).toBe(1);
    expect(evaluate(t, wordUnit(2), page, 100).opacity).toBe(0);
  });

  it("exit runs in the last durationMs of the page", () => {
    const t = only({
      select: { scope: "page" },
      trigger: "exit",
      durationMs: 100,
      ease: "linear",
      props: { opacity: [1, 0] },
    });
    const unit: Unit = {
      scope: "page",
      index: 0,
      count: 1,
      role: "normal",
      seedIndex: 0,
    };
    expect(evaluate(t, unit, page, 1300).opacity).toBe(1);
    expect(evaluate(t, unit, page, 1450).opacity).toBeCloseTo(0.5);
    expect(evaluate(t, unit, page, 1500).opacity).toBe(0);
  });

  it("active applies only while the word is said, unless it keeps", () => {
    const base = {
      select: { scope: "word" },
      trigger: "active",
      durationMs: 100,
      ease: "linear",
      props: { scale: [1, 2] },
    };
    const reverts = only(base);
    expect(evaluate(reverts, wordUnit(0), page, 50).scale).toBeCloseTo(1.5);
    expect(evaluate(reverts, wordUnit(0), page, 450).scale).toBe(1);
    expect(evaluate(reverts, wordUnit(1), page, 100).scale).toBe(1);
    const keeps = only({ ...base, after: "keep" });
    expect(evaluate(keeps, wordUnit(0), page, 450).scale).toBe(2);
  });

  it("loop is periodic and offset by the stagger", () => {
    const t = only({
      select: { scope: "word" },
      trigger: "loop",
      periodMs: 1000,
      staggerMs: 250,
      ease: "linear",
      props: { y: [0, 1] },
    });
    const a = evaluate(t, wordUnit(0), page, 0).y;
    const b = evaluate(t, wordUnit(0), page, 1000).y;
    expect(a).toBeCloseTo(b);
    expect(evaluate(t, wordUnit(1), page, 0).y).not.toBeCloseTo(a);
  });

  it("jitter is the same every time and differs per word", () => {
    const t = only({
      select: { scope: "word" },
      trigger: "enter",
      durationMs: 1,
      props: {},
      jitter: { rotate: 10, x: 0, y: 0, scale: 0 },
      seed: 5,
    });
    const first = evaluate(t, wordUnit(0), page, 100).rotate;
    expect(evaluate(t, wordUnit(0), page, 100).rotate).toBe(first);
    expect(evaluate(t, wordUnit(1), page, 100).rotate).not.toBe(first);
    expect(Math.abs(first)).toBeLessThanOrEqual(10);
  });

  it("is a pure function of time, in any order", () => {
    const t = normalizeTemplate({ version: 2 });
    const times = [0, 700, 100, 1400, 700];
    const forward = times.map((time) => evaluate(t, wordUnit(1), page, time));
    const backward = [...times]
      .reverse()
      .map((time) => evaluate(t, wordUnit(1), page, time))
      .reverse();
    expect(forward).toEqual(backward);
  });
});

describe("seeded", () => {
  it("stays within [-1, 1] and is stable", () => {
    for (let i = 0; i < 50; i++) {
      const value = seeded(3, i, 1);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
      expect(seeded(3, i, 1)).toBe(value);
    }
  });
});

describe("roleOf", () => {
  const template = normalizeTemplate({
    version: 2,
    roles: { key: {}, other: {} },
    roleRules: [
      { role: "other", when: "number" },
      { role: "key", when: "longest" },
    ],
  });
  it("prefers the word's own role, then emphasis, then the rules in order", () => {
    expect(roleOf(word("x", 0, 1, { role: "other" }), page, template)).toBe(
      "other",
    );
    expect(roleOf(word("x", 0, 1, { emphasis: true }), page, template)).toBe(
      "key",
    );
    expect(roleOf(words[2] as CaptionWord, page, template)).toBe("other");
    expect(roleOf(words[1] as CaptionWord, page, template)).toBe("key");
    expect(roleOf(words[0] as CaptionWord, page, template)).toBe("normal");
  });
  it("falls back to normal for a role the template lacks", () => {
    expect(roleOf(word("x", 0, 1, { role: "ghost" }), page, template)).toBe(
      "normal",
    );
  });
});
