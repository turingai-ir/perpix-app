import { expect, test } from "@playwright/test";

import type { Clip } from "../projects/model/clips";
import {
  MIN_CLIP_MS,
  moveBy,
  removeAt,
  splitAt,
  trimEnd,
  trimStart,
} from "../editor/model/edit";

const clip = (id: string, from = 0, to = 4000, file = "f1"): Clip => ({
  id,
  file_uuid: file,
  name: id,
  duration_ms: 10_000,
  source_in_ms: from,
  source_out_ms: to,
});
const ranges = (clips: Clip[]) =>
  clips.map((item) => [item.id, item.source_in_ms, item.source_out_ms]);

test.describe("cutting and joining clips", () => {
  test("splits one clip into two that together play the same thing", () => {
    const result = splitAt([clip("a")], 0, 1500, () => "b");
    expect(ranges(result!.clips)).toEqual([
      ["a", 0, 1500],
      ["b", 1500, 4000],
    ]);
    expect(result).toMatchObject({ focusIndex: 1, focusOffsetMs: 0 });
  });

  test("keeps the other clips where they were when one is split", () => {
    const result = splitAt(
      [clip("x", 0, 1000), clip("a"), clip("y", 0, 1000)],
      1,
      2000,
      () => "b",
    );
    expect(result!.clips.map((item) => item.id)).toEqual(["x", "a", "b", "y"]);
  });

  test("refuses a split that would leave a flash of a clip", () => {
    expect(splitAt([clip("a")], 0, MIN_CLIP_MS - 1)).toBeNull();
    expect(splitAt([clip("a")], 0, 4000 - MIN_CLIP_MS + 1)).toBeNull();
    expect(splitAt([clip("a")], 0, MIN_CLIP_MS, () => "b")).not.toBeNull();
    expect(splitAt([clip("a")], 5, 1000)).toBeNull();
  });

  test("trims the start up to the playhead", () => {
    const result = trimStart([clip("a", 500, 4000)], 0, 1500);
    expect(ranges(result!.clips)).toEqual([["a", 1500, 4000]]);
    expect(trimStart([clip("a", 500, 4000)], 0, 500)).toBeNull();
    expect(trimStart([clip("a", 500, 4000)], 0, 3900)).toBeNull();
  });

  test("trims the end from the playhead and stays at the new end", () => {
    const result = trimEnd([clip("a", 500, 4000)], 0, 2500);
    expect(ranges(result!.clips)).toEqual([["a", 500, 2500]]);
    expect(result!.focusOffsetMs).toBe(1999);
    expect(trimEnd([clip("a", 500, 4000)], 0, 4000)).toBeNull();
    expect(trimEnd([clip("a", 500, 4000)], 0, 600)).toBeNull();
  });

  test("removes a clip and lands on the one that takes its place", () => {
    const clips = [clip("a"), clip("b"), clip("c")];
    expect(removeAt(clips, 1)).toMatchObject({ focusIndex: 1 });
    expect(removeAt(clips, 1)!.clips.map((item) => item.id)).toEqual([
      "a",
      "c",
    ]);
    expect(removeAt(clips, 2)).toMatchObject({ focusIndex: 1 });
    expect(removeAt([clip("a")], 0)).toMatchObject({
      clips: [],
      focusIndex: 0,
    });
    expect(removeAt(clips, 9)).toBeNull();
  });

  test("moves a clip earlier or later and the playhead goes with it", () => {
    const clips = [clip("a"), clip("b"), clip("c")];
    const later = moveBy(clips, 0, 1, 700);
    expect(later!.clips.map((item) => item.id)).toEqual(["b", "a", "c"]);
    expect(later).toMatchObject({ focusIndex: 1, focusOffsetMs: 700 });
    expect(moveBy(clips, 0, -1, 0)).toBeNull();
    expect(moveBy(clips, 2, 1, 0)).toBeNull();
  });

  test("never changes the clips it was given", () => {
    const clips = [clip("a")];
    const snapshot = JSON.stringify(clips);
    splitAt(clips, 0, 1500, () => "b");
    trimStart(clips, 0, 1500);
    trimEnd(clips, 0, 1500);
    removeAt(clips, 0);
    expect(JSON.stringify(clips)).toBe(snapshot);
  });
});
