import { expect, test } from "@playwright/test";
import {
  captionWordKey,
  correctedSourceWords,
  readCaptionCorrections,
  updateCaptionCorrection,
  writeCaptionCorrections,
} from "../editor/model/caption-corrections";
import {
  applyCaptionMatches,
  findCaptionMatches,
} from "../editor/model/caption-matches";
import { buildTimeline } from "../editor/model/timeline";
import type { Transcript } from "../projects/model/transcript";

function transcript(
  uuid: string,
  fileUuid: string,
  texts: string[],
): Transcript {
  return {
    uuid,
    file_uuid: fileUuid,
    status: "COMPLETED",
    duration_ms: 2000,
    language: "fa",
    created_at: "",
    expire_at: "",
    failure_message: null,
    text: texts.join(" "),
    words: texts.map((text, index) => ({
      text,
      start_ms: index * 250,
      end_ms: index * 250 + 200,
      speaker: null,
    })),
  };
}

const clip = (id: string, fileUuid: string, end = 2000) => ({
  id,
  file_uuid: fileUuid,
  name: id,
  duration_ms: 2000,
  source_in_ms: 0,
  source_out_ms: end,
});

test("corrections belong to the transcript and source word index", () => {
  const key = captionWordKey("t1", 0);
  const corrections = updateCaptionCorrection({}, key, "درود");
  const document = { tracks: [{ kind: "caption", words: [] }] };
  const saved = writeCaptionCorrections(document, corrections);

  expect(saved.tracks).toEqual(document.tracks);
  expect(readCaptionCorrections(saved)[key]).toBe("درود");
  expect(
    readCaptionCorrections(saved)[captionWordKey("t2", 0)],
  ).toBeUndefined();
  expect(
    readCaptionCorrections(saved)[captionWordKey("t1", 1)],
  ).toBeUndefined();
  expect(
    writeCaptionCorrections(
      saved,
      updateCaptionCorrection(corrections, key, null),
    ),
  ).toEqual(document);
});

test("legacy documents and malformed corrections are tolerated", () => {
  expect(readCaptionCorrections({ tracks: [] })).toEqual({});
  expect(
    readCaptionCorrections({
      caption_corrections: { "t1:0": "درود", "t1:1": "", "t1:2": 42 },
    }),
  ).toEqual({ "t1:0": "درود" });
});

test("finds phrases across the project, counts reused source words once, and respects clip boundaries", () => {
  const a = transcript("a", "f1", ["روی", "White", "board,", "بکش"]);
  const b = transcript("b", "f2", ["white", "board", "حاضر"]);
  const c = transcript("c", "f3", ["white", "board"]);
  const timeline = buildTimeline([
    clip("cut", "f3", 260),
    clip("first", "f1"),
    clip("copy", "f1"),
    clip("second", "f2"),
  ]);
  const matches = findCaptionMatches(
    timeline,
    { f1: a, f2: b, f3: c },
    {},
    "white board",
  );
  expect(matches.map(({ key, clipName }) => [key, clipName])).toEqual([
    ["a:1", "first"],
    ["b:0", "second"],
  ]);

  const corrections = applyCaptionMatches({}, matches, "وایت‌برد");
  expect(
    correctedSourceWords(a, corrections).map(({ text, start_ms, end_ms }) => [
      text,
      start_ms,
      end_ms,
    ]),
  ).toEqual([
    ["روی", 0, 200],
    ["وایت‌برد,", 250, 700],
    ["بکش", 750, 950],
  ]);
  const edited = updateCaptionCorrection(corrections, "a:1", "تخته");
  expect(correctedSourceWords(a, edited)[1]).toMatchObject({
    text: "تخته",
    start_ms: 250,
    end_ms: 700,
  });
  const restored = updateCaptionCorrection(edited, "a:1", null);
  expect(correctedSourceWords(a, restored).map(({ text }) => text)).toEqual([
    "روی",
    "White",
    "board,",
    "بکش",
  ]);
});

test("matches Persian spelling variants without crossing a change of speaker", () => {
  const source = transcript("a", "f1", ["وايت‌برد", "white", "board"]);
  source.words[1].speaker = "speaker-1";
  source.words[2].speaker = "speaker-2";
  const timeline = buildTimeline([clip("first", "f1")]);
  expect(
    findCaptionMatches(timeline, { f1: source }, {}, "وایتبرد"),
  ).toHaveLength(1);
  expect(
    findCaptionMatches(timeline, { f1: source }, {}, "white board"),
  ).toHaveLength(0);
});
