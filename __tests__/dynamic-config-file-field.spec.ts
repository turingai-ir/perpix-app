import { expect, test } from "@playwright/test";

import { isListFileField } from "../src/pages/(app)/generation/_components/dynamic-config/file-upload/media";

test("array reference field without x-file metadata is a file list", () => {
  const property = {
    type: "array" as const,
    maxItems: 4,
    items: { type: "string" as const },
  };

  expect(isListFileField(property)).toBe(true);
});

test("single file fields still stop after one image", () => {
  expect(
    isListFileField({ type: "string", "x-file": { type: "single" } }),
  ).toBe(false);
  expect(isListFileField({ type: ["array", "null"] })).toBe(true);
});
