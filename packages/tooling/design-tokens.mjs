/**
 * Oxlint rule: class strings must use design tokens, not raw values.
 * Spec: docs/agent-guides/DESIGN_LANGUAGE.md. Add a check by adding one entry to CHECKS.
 */
const PALETTE = [
  "white",
  "black",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
const COLOR_UTILS =
  "text|bg|border|ring|fill|stroke|from|to|via|outline|divide";

const CHECKS = [
  {
    test: /\btext-\[[\d.]+(px|rem)\]/,
    message:
      "Use a type role (text-caption … text-large-title), not an arbitrary font size.",
  },
  {
    test: /\brounded(-[a-z]{1,2})?-\[[\d.]+(px|rem)\]/,
    message:
      "Use a named radius (rounded-md … rounded-3xl), not an arbitrary one.",
  },
  {
    test: /-\[#[\da-f]{3,8}\]/i,
    message: "Use a semantic colour token, not a hex value.",
  },
  {
    test: new RegExp(`\\b(${COLOR_UTILS})-(${PALETTE.join("|")})(-\\d+)?\\b`),
    message:
      "Use a semantic token (primary, muted, success, night-foreground …), not a Tailwind palette colour.",
  },
  {
    test: /rgb\((255_255_255|0_0_0)|oklch\((1|0)_0_0|inset_0_1px_#fff/,
    message:
      "Pure white/black literals: use night / night-foreground / shadow-ink via color-mix, or an inset-shadow-highlight-* / shadow-* token.",
  },
  {
    test: /\btransition-all\b/,
    message: "List the properties: transition-colors, transition-transform …",
  },
];

const noRawValues = {
  meta: { type: "problem", schema: [] },
  create(context) {
    const check = (node, text) => {
      for (const { test, message } of CHECKS) {
        if (test.test(text)) context.report({ node, message });
      }
    };
    return {
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

export default { rules: { "no-raw-values": noRawValues } };
