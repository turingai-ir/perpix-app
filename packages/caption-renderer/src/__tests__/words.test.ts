import { describe, expect, it } from "vitest";
import { buildPages, pageAt, type CaptionWord } from "../words";

const w = (startMs: number, endMs: number): CaptionWord => ({
  text: "w",
  startMs,
  endMs,
});

describe("buildPages", () => {
  it("groups by count and splits at long pauses", () => {
    const words = [w(0, 100), w(150, 250), w(300, 400), w(2000, 2100)];
    expect(buildPages(words, 2, 700).map((p) => p.words.length)).toEqual([
      2, 1, 1,
    ]);
    expect(buildPages(words, 5, 700).map((p) => p.words.length)).toEqual([
      3, 1,
    ]);
    expect(buildPages(words, 5, 5000).map((p) => p.words.length)).toEqual([4]);
  });

  it("holds a page briefly but never into the next one", () => {
    const pages = buildPages([w(0, 100), w(200, 300)], 1, 700);
    expect(pages[0]?.endMs).toBe(200);
    expect(pages[1]?.endMs).toBe(550);
  });

  it("handles no words", () => {
    expect(buildPages([], 3)).toEqual([]);
  });
});

describe("pageAt", () => {
  const pages = buildPages([w(0, 100), w(1000, 1100)], 1, 700);
  it("finds the page on screen, or none in a gap", () => {
    expect(pageAt(pages, 50)?.index).toBe(0);
    expect(pageAt(pages, 1050)?.index).toBe(1);
    expect(pageAt(pages, 600)).toBeNull();
    expect(pageAt(pages, -1)).toBeNull();
    expect(pageAt(pages, 5000)).toBeNull();
  });
});
