import { expect, test } from "@playwright/test";

import type { Clip } from "../projects/model/clips";
import { buildTimeline, locate, timelineWords } from "../editor/model/timeline";

const clip = (id: string, file: string, from: number, to: number): Clip => ({
  id,
  file_uuid: file,
  name: id,
  duration_ms: 10_000,
  source_in_ms: from,
  source_out_ms: to,
});

test.describe("the studio timeline", () => {
  test("places clips one after another", () => {
    const timeline = buildTimeline([
      clip("a", "f1", 0, 3000),
      clip("b", "f2", 1000, 3000),
    ]);
    expect(timeline.durationMs).toBe(5000);
    expect(
      timeline.segments.map(({ startMs, endMs }) => [startMs, endMs]),
    ).toEqual([
      [0, 3000],
      [3000, 5000],
    ]);
  });

  test("ignores a clip with nothing left to play", () => {
    const timeline = buildTimeline([
      clip("a", "f1", 2000, 2000),
      clip("b", "f1", 0, 1000),
    ]);
    expect(timeline.segments).toHaveLength(1);
    expect(timeline.durationMs).toBe(1000);
  });

  test("finds the clip and the source moment of a timeline moment", () => {
    const timeline = buildTimeline([
      clip("a", "f1", 0, 3000),
      clip("b", "f2", 1000, 3000),
    ]);
    expect(locate(timeline, 0)).toEqual({ index: 0, sourceMs: 0 });
    expect(locate(timeline, 2999)).toEqual({ index: 0, sourceMs: 2999 });
    expect(locate(timeline, 3000)).toEqual({ index: 1, sourceMs: 1000 });
    expect(locate(timeline, 4500)).toEqual({ index: 1, sourceMs: 2500 });
  });

  test("clamps a moment past either end", () => {
    const timeline = buildTimeline([clip("a", "f1", 500, 2500)]);
    expect(locate(timeline, -100)).toEqual({ index: 0, sourceMs: 500 });
    expect(locate(timeline, 99_999)).toEqual({ index: 0, sourceMs: 2500 });
    expect(locate(buildTimeline([]), 0)).toBeNull();
  });

  test("puts each clip's words on the timeline's clock", () => {
    const timeline = buildTimeline([
      clip("a", "f1", 1000, 3000),
      clip("b", "f2", 0, 2000),
    ]);
    const words = timelineWords(
      timeline,
      new Map([
        ["f1", [{ text: "x", start_ms: 1200, end_ms: 1500 }]],
        ["f2", [{ text: "y", start_ms: 100, end_ms: 400 }]],
      ]),
    );
    expect(words).toEqual([
      { text: "x", startMs: 200, endMs: 500 },
      { text: "y", startMs: 2100, endMs: 2400 },
    ]);
  });

  test("drops words outside the cut and trims the ones it cuts through", () => {
    const timeline = buildTimeline([clip("a", "f1", 1000, 2000)]);
    const words = timelineWords(
      timeline,
      new Map([
        [
          "f1",
          [
            { text: "before", start_ms: 0, end_ms: 900 },
            { text: "edge-in", start_ms: 800, end_ms: 1200 },
            { text: "inside", start_ms: 1300, end_ms: 1600 },
            { text: "edge-out", start_ms: 1900, end_ms: 2300 },
            { text: "after", start_ms: 2500, end_ms: 3000 },
          ],
        ],
      ]),
    );
    expect(words.map((word) => word.text)).toEqual([
      "edge-in",
      "inside",
      "edge-out",
    ]);
    expect(words[0]).toMatchObject({ startMs: 0, endMs: 200 });
    expect(words[2]).toMatchObject({ startMs: 900, endMs: 1000 });
  });

  test("the same file split in two keeps each word in the half it is spoken in", () => {
    const timeline = buildTimeline([
      clip("a", "f1", 0, 1000),
      clip("b", "f1", 1000, 2000),
    ]);
    const words = timelineWords(
      timeline,
      new Map([["f1", [{ text: "w", start_ms: 1100, end_ms: 1400 }]]]),
    );
    expect(words).toEqual([{ text: "w", startMs: 1100, endMs: 1400 }]);
  });
});
