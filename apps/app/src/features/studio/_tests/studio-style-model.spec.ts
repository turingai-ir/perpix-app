import { expect, test } from "@playwright/test";
import { DEFAULT_TEMPLATE } from "@perpix/caption-renderer";
import { readCaptionStyle, withBaseColor } from "../styles/model/caption-style";

test("reads a normalized project snapshot and tolerates old or malformed documents", () => {
  expect(readCaptionStyle({ tracks: [] })).toBeNull();
  expect(readCaptionStyle({ caption_style: { config: "invalid" } })).toBeNull();
  expect(
    readCaptionStyle({
      caption_style: {
        preset_uuid: "preset",
        config: { version: 2, layout: { anchor: "top" } },
      },
    }),
  ).toMatchObject({
    preset_uuid: "preset",
    config: { layout: { anchor: "top" } },
  });
});

test("replacing the base color clears gradient and palette without changing word emphasis", () => {
  const config = {
    ...DEFAULT_TEMPLATE,
    base: {
      ...DEFAULT_TEMPLATE.base,
      fill: {
        ...DEFAULT_TEMPLATE.base.fill,
        gradient: { enabled: true, from: "#ffffff", to: "#aaaaaa" },
        palette: ["#ffffff"],
      },
    },
  };
  const updated = withBaseColor(config, "#44cc88");
  expect(updated.base.fill).toMatchObject({
    color: "#44cc88",
    gradient: { enabled: false },
    palette: [],
  });
  expect(updated.states).toBe(config.states);
  expect(config.base.fill.gradient.enabled).toBe(true);
});
