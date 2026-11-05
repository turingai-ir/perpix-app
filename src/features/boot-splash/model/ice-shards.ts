export interface Point {
  x: number;
  y: number;
}

export interface IceShard {
  points: Point[];
  /** Unit direction from the impact point towards the shard's centre. */
  direction: Point;
  /** 0 for the ring around the impact, growing outwards. */
  ring: number;
}

export interface IcePattern {
  impact: Point;
  shards: IceShard[];
  /** Crack polylines (rays and ring segments) in drawing order. */
  cracks: Point[][];
}

const RAY_COUNT = 11;
const RING_STEPS = [0.06, 0.16, 0.34, 0.62];

/** Small deterministic PRNG so a pattern can be reproduced in tests. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function centroid(points: Point[]): Point {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
    x: 0,
    y: 0,
  });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * Radial ice-fracture pattern for a `width` × `height` viewport: jittered rays
 * from the impact, cut by jittered rings, so neighbouring shards share edges.
 */
export function createIcePattern(
  width: number,
  height: number,
  seed = Date.now(),
): IcePattern {
  const random = createRandom(seed);
  const impact = {
    x: width * (0.5 + (random() - 0.5) * 0.06),
    y: height * (0.5 + (random() - 0.5) * 0.06),
  };
  const reach = Math.hypot(width, height);
  const angles = Array.from(
    { length: RAY_COUNT },
    (_, i) => ((i + (random() - 0.5) * 0.7) / RAY_COUNT) * Math.PI * 2,
  );
  const radii = [...RING_STEPS, 1.2].map((step) =>
    angles.map(() => reach * step * (0.82 + random() * 0.36)),
  );
  const vertex = (ring: number, ray: number): Point => {
    const angle = angles[ray % RAY_COUNT];
    const radius = ring < 0 ? 0 : radii[ring][ray % RAY_COUNT];
    return {
      x: impact.x + Math.cos(angle) * radius,
      y: impact.y + Math.sin(angle) * radius,
    };
  };

  const shards: IceShard[] = [];
  for (let ring = 0; ring < radii.length; ring += 1) {
    for (let ray = 0; ray < RAY_COUNT; ray += 1) {
      const outer = [vertex(ring, ray), vertex(ring, ray + 1)];
      const points =
        ring === 0
          ? [impact, ...outer]
          : [vertex(ring - 1, ray), ...outer, vertex(ring - 1, ray + 1)];
      const middle = centroid(points);
      const length = Math.hypot(middle.x - impact.x, middle.y - impact.y) || 1;
      shards.push({
        points,
        ring,
        direction: {
          x: (middle.x - impact.x) / length,
          y: (middle.y - impact.y) / length,
        },
      });
    }
  }

  const rays = angles.map((_, ray) => [
    impact,
    ...radii.map((_, ring) => vertex(ring, ray)),
  ]);
  const rings = radii
    .slice(0, -1)
    .map((_, ring) =>
      Array.from({ length: RAY_COUNT + 1 }, (_, ray) => vertex(ring, ray)),
    );

  return { impact, shards, cracks: [...rays, ...rings] };
}
