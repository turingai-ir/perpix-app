import { describe, expect, it } from "vitest";
import { EASES } from "../template";
import { EASINGS } from "../easing";

describe("EASINGS", () => {
  it("has a curve for every name the template allows", () => {
    for (const name of EASES) expect(typeof EASINGS[name]).toBe("function");
  });

  it("starts at 0 and ends at 1", () => {
    for (const name of EASES) {
      expect(EASINGS[name](0)).toBeCloseTo(0, 6);
      expect(EASINGS[name](1)).toBeCloseTo(1, 6);
    }
  });

  it("matches the known values of the curves it copies", () => {
    expect(EASINGS["power2.out"](0.5)).toBeCloseTo(0.875, 6);
    expect(EASINGS["power3.out"](0.5)).toBeCloseTo(0.9375, 6);
    expect(EASINGS["power2.inOut"](0.5)).toBeCloseTo(0.5, 6);
    expect(EASINGS["sine.inOut"](0.5)).toBeCloseTo(0.5, 6);
    expect(EASINGS["back.out"](0.5)).toBeCloseTo(1.0877, 3);
    expect(EASINGS["bounce.out"](0.5)).toBeCloseTo(0.765625, 6);
    expect(EASINGS["expo.out"](0.5)).toBeCloseTo(0.96875, 5);
    expect(EASINGS["elastic.out"](0.5)).toBeCloseTo(1.0156, 3);
  });
});
