import { describe, expect, it } from "vitest";
import { captionDirection, visualWordOrder } from "../caption-bidi";

describe("mixed caption lines", () => {
  it("keeps consecutive English words in reading order inside Persian", () => {
    const words = ["روی", "Google", "Drive", "بذار"];
    expect(visualWordOrder(words, captionDirection(words))).toEqual([
      3, 1, 2, 0,
    ]);
  });

  it("keeps Persian words together inside an English line", () => {
    const words = ["Use", "تخته", "سفید", "here"];
    expect(visualWordOrder(words, captionDirection(words))).toEqual([
      0, 2, 1, 3,
    ]);
  });

  it("keeps Latin numbers and neutral punctuation inside an English run", () => {
    const words = ["نسخه", "Google", "Drive", "2.0", "–", "Beta", "رسید"];
    expect(visualWordOrder(words, captionDirection(words))).toEqual([
      6, 1, 2, 3, 4, 5, 0,
    ]);
  });

  it("ignores numbers and punctuation when choosing the paragraph direction", () => {
    const words = ["۱۲۳", "…", "سلام"];
    expect(captionDirection(words)).toBe("rtl");
    expect(visualWordOrder(["سلام", "دنیا"], "rtl")).toEqual([1, 0]);
    expect(visualWordOrder(["Hello", "world"], "ltr")).toEqual([0, 1]);
  });
});
