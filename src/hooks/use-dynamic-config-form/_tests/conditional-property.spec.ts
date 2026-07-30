import { expect, test } from "@playwright/test";

import { getConditionalProperty } from "../schema";

const imageSchema = {
  type: "object" as const,
  properties: {
    mode: { type: "string" as const, enum: ["text_to_image"] },
    resolution: { type: "string" as const, enum: ["1024px", "1536px"] },
    aspect_ratio: {
      type: "string" as const,
      enum: ["1:1", "3:2", "2:3"],
      default: "1:1",
    },
  },
  allOf: [
    {
      if: {
        properties: { mode: { const: "text_to_image" } },
        required: ["mode"],
      },
      then: {
        allOf: [
          {
            if: {
              properties: { resolution: { const: "1024px" } },
              required: ["resolution"],
            },
            then: { properties: { aspect_ratio: { enum: ["1:1"] } } },
          },
          {
            if: {
              properties: { resolution: { const: "1536px" } },
              required: ["resolution"],
            },
            then: { properties: { aspect_ratio: { enum: ["3:2", "2:3"] } } },
          },
        ],
      },
    },
  ],
};

test("limits dependent select options to the active schema condition", () => {
  expect(
    getConditionalProperty(imageSchema, "aspect_ratio", {
      mode: "text_to_image",
      resolution: "1024px",
    })?.enum,
  ).toEqual(["1:1"]);

  expect(
    getConditionalProperty(imageSchema, "aspect_ratio", {
      mode: "text_to_image",
      resolution: "1536px",
    })?.enum,
  ).toEqual(["3:2", "2:3"]);
});
