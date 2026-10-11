import { expect, test } from "@playwright/test";

import { getDurationOptions } from "../src/pages/(app)/generation/video/_utils/duration-options";

test("duration choices preserve sparse enum values and JSON types", () => {
  expect(getDurationOptions({ enum: ["auto", "5", 5, 12] })?.values).toEqual([
    "auto",
    "5",
    5,
    12,
  ]);
});

test("duration choices honor enum bounds and never invent automatic duration", () => {
  expect(
    getDurationOptions({
      type: "integer",
      enum: [2, 5, 10, 30],
      minimum: 3,
      maximum: 12,
    })?.values,
  ).toEqual([5, 10]);
});

test("duration choices cover Wan-style automatic or bounded integer alternatives", () => {
  const options = getDurationOptions({
    oneOf: [{ const: "auto" }, { type: "integer", minimum: 2, maximum: 30 }],
  });
  expect(options?.values).toEqual([
    "auto",
    ...Array.from({ length: 29 }, (_, i) => i + 2),
  ]);
});

test("duration choices support bounded integer and string type unions", () => {
  expect(
    getDurationOptions({
      type: ["integer", "string"],
      minimum: 2,
      maximum: 4,
      default: "auto",
    })?.values,
  ).toEqual(["auto", 2, 3, 4]);
});

test("duration choices enforce numeric constraints beyond min and max", () => {
  const property = {
    type: "integer" as const,
    minimum: 2,
    maximum: 10,
    multipleOf: 3,
  };
  expect(getDurationOptions(property)?.values).toEqual([3, 6, 9]);
});

test("duration choices retain native bounds for consecutive numeric values", () => {
  expect(
    getDurationOptions({ type: "integer", minimum: 3, maximum: 6 }),
  ).toEqual({ values: [3, 4, 5, 6], start: 3, end: 6 });
});

test("duration choices handle a single fixed value and empty schemas safely", () => {
  expect(getDurationOptions({ type: "integer", const: 5 })).toEqual({
    values: [5],
    start: 5,
    end: 5,
  });
  expect(getDurationOptions({ type: "integer", enum: [] })).toBeNull();
  expect(
    getDurationOptions({ type: "integer", minimum: 10, maximum: 5 }),
  ).toBeNull();
  expect(getDurationOptions({ type: "integer", minimum: 2 })).toBeNull();
});
