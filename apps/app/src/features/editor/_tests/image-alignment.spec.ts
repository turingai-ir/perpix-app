import { expect, test } from "@playwright/test";

import {
  getImageAlignmentSnaps,
  hasSameGuides,
} from "../model/image-alignment";

test("an image edge within 8px snaps to the closest target guide", () => {
  // Image guides 0/50/100, target guides 3/203/403: only the start is close.
  expect(getImageAlignmentSnaps(0, 100, 3, 400)).toEqual([
    { delta: 3, position: 3 },
  ]);
});

test("guides farther than 8px do not snap", () => {
  // Image guides 0/50/100, target guides 20/170/320.
  expect(getImageAlignmentSnaps(0, 100, 20, 300)).toEqual([]);
});

test("equally close guides all snap", () => {
  // Same size and position: start, center and end all match.
  expect(getImageAlignmentSnaps(10, 100, 10, 100)).toHaveLength(3);
});

test("guide lists compare by orientation and position", () => {
  const guide = { orientation: "vertical" as const, position: 1 };

  expect(hasSameGuides([guide], [{ ...guide }])).toBe(true);
  expect(hasSameGuides([guide], [{ ...guide, position: 2 }])).toBe(false);
  expect(hasSameGuides([], [guide])).toBe(false);
});
