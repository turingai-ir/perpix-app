import { describe, expect, it } from "vitest";
import {
  CAPTION_CONFIG_SCHEMA_VERSION,
  DEFAULT_ANIMATOR,
  DEFAULT_TEMPLATE,
  MAX_ANIMATORS,
  normalizeTemplate,
} from "../index";
import { REFERENCE_TEMPLATES } from "../references";

describe("normalizeTemplate", () => {
  it("never throws on junk and gives a complete template", () => {
    for (const junk of [
      null,
      undefined,
      5,
      "x",
      [],
      {},
      { version: 2 },
      { version: 2, base: 7 },
    ]) {
      const template = normalizeTemplate(junk);
      expect(template.version).toBe(2);
      expect(template.base.font.size).toBeGreaterThan(0);
    }
  });

  it("clamps numbers and drops unknown kinds", () => {
    const template = normalizeTemplate({
      version: 2,
      base: { font: { size: 9999, weight: 850 }, fill: { color: "red" } },
      layout: { anchor: "sideways", wordsPerPage: 99 },
      animators: [
        { trigger: "explode", ease: "nope", props: { scale: [0, 99], x: "a" } },
      ],
    });
    expect(template.base.font.size).toBe(240);
    expect(template.base.font.weight).toBe(900);
    expect(template.base.fill.color).toBe(DEFAULT_TEMPLATE.base.fill.color);
    expect(template.layout.anchor).toBe("bottom");
    expect(template.layout.wordsPerPage).toBe(12);
    const [animator] = template.animators;
    expect(animator?.trigger).toBe("enter");
    expect(animator?.ease).toBe(DEFAULT_ANIMATOR.ease);
    expect(animator?.props.scale).toEqual([0, 4]);
    expect(animator?.props.x).toBeUndefined();
  });

  it("limits how many animators and roles are kept", () => {
    const animators = Array.from({ length: 100 }, () => ({}));
    const roles = Object.fromEntries(
      Array.from({ length: 30 }, (_, i) => [`r${i}`, {}]),
    );
    const template = normalizeTemplate({ version: 2, animators, roles });
    expect(template.animators).toHaveLength(MAX_ANIMATORS);
    expect(Object.keys(template.roles).length).toBeLessThanOrEqual(7);
  });

  it("keeps an empty animator list the author chose", () => {
    expect(normalizeTemplate({ version: 2, animators: [] }).animators).toEqual(
      [],
    );
    expect(normalizeTemplate({ version: 2 }).animators.length).toBeGreaterThan(
      0,
    );
  });

  it("rejects role names that are not short lowercase words", () => {
    const template = normalizeTemplate({
      version: 2,
      roles: { key: {}, __proto__: {}, "Bad Name": {}, normal: {} },
    });
    expect(Object.keys(template.roles)).toEqual(["key"]);
  });

  it("is idempotent", () => {
    for (const { template } of Object.values(REFERENCE_TEMPLATES)) {
      expect(normalizeTemplate(template)).toEqual(template);
    }
  });

  it("writes the schema version it reads", () => {
    expect(CAPTION_CONFIG_SCHEMA_VERSION).toBe(2);
  });
});

describe("migration from version 1", () => {
  it("turns a pop entrance into a page animator and a wipe into a decoration", () => {
    const template = normalizeTemplate({
      colors: { text: "#ffffff", active: "#00ff00", stroke: "#000000" },
      animation: { entrance: "pop", wordEffect: "wipe", spokenStays: true },
    });
    expect(template.version).toBe(2);
    expect(
      template.animators.some(
        (a) => a.select.scope === "page" && a.props.scale,
      ),
    ).toBe(true);
    const [wipe] = template.decorations;
    expect(wipe?.kind).toBe("wipe");
    expect(wipe?.color).toBe("#00ff00");
    expect(wipe?.select.states).toEqual(["active", "spoken"]);
  });

  it("turns auto emphasis into a key role and a rule", () => {
    const template = normalizeTemplate({
      emphasis: { auto: "numbers", color: "#ff0000", scale: 1.5 },
    });
    expect(template.roles.key?.color).toBe("#ff0000");
    expect(template.roleRules).toEqual([{ role: "key", when: "number" }]);
  });

  it("keeps a word-effect colour as the active state colour", () => {
    const template = normalizeTemplate({
      colors: { text: "#ffffff", active: "#123456", stroke: "#000000" },
      animation: { wordEffect: "color" },
    });
    expect(template.states.active.color).toBe("#123456");
  });
});

describe("animator presets", () => {
  it("every preset survives normalisation unchanged in meaning", async () => {
    const { ANIMATOR_PRESETS } = await import("../references");
    for (const [key, preset] of Object.entries(ANIMATOR_PRESETS)) {
      const template = normalizeTemplate({
        version: 2,
        animators: [preset.animator],
      });
      const [animator] = template.animators;
      expect(animator, key).toBeDefined();
      expect(Object.keys(animator?.props ?? {}).length, key).toBeGreaterThan(0);
      expect(normalizeTemplate(template), key).toEqual(template);
    }
  });
});

describe("decoration kinds and palette", () => {
  it("accepts the new kinds, clamps the count and keeps only colours in the palette", () => {
    const template = normalizeTemplate({
      version: 2,
      base: {
        fill: {
          palette: [
            "#fff",
            "red",
            5,
            "#00ff00",
            "#111",
            "#222",
            "#333",
            "#444",
          ],
        },
      },
      decorations: [
        { kind: "sparkle", count: 99 },
        { kind: "circle" },
        { kind: "nope" },
      ],
    });
    expect(template.decorations.map((d) => d.kind)).toEqual([
      "sparkle",
      "circle",
      "pill",
    ]);
    expect(template.decorations[0]?.count).toBe(12);
    // Only the first six entries are read, and the ones that are not colours are dropped.
    expect(template.base.fill.palette).toEqual([
      "#fff",
      "#00ff00",
      "#111",
      "#222",
    ]);
  });
});
