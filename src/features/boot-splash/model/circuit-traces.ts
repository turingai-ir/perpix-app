export type Trace = ReadonlyArray<readonly [number, number]>;

/** Shape-space bounds of the "P" glyph before it is centred. */
export const GLYPH_CENTRE = { x: 0.925, y: 1.5 } as const;

function bowlArc(radius: number, from: number, to: number, steps: number) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const angle = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    return [
      1.0 + Math.cos(angle) * radius,
      2.15 + Math.sin(angle) * radius,
    ] as const;
  });
}

/**
 * Circuit traces etched on the front face of the logo "P", echoing the
 * circuit-board pattern of the PerPix mark. Coordinates are in shape space.
 */
export const P_TRACES: Trace[] = [
  [
    [0.2, 0.18],
    [0.2, 0.95],
    [0.45, 1.2],
    [0.45, 1.55],
  ],
  [
    [0.52, 0.18],
    [0.52, 0.72],
  ],
  [
    [0.14, 1.35],
    [0.14, 2.35],
    [0.4, 2.6],
  ],
  [
    [0.12, 2.86],
    [0.62, 2.86],
    [0.86, 2.78],
  ],
  bowlArc(0.67, -78, 78, 10),
  [
    [1.62, 2.15],
    [1.76, 2.15],
  ],
  [
    [0.36, 1.45],
    [0.62, 1.45],
    [0.9, 1.45],
  ],
];
