import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Shape,
  Vector2,
  Vector3,
} from "three";

import type { IcePattern } from "../model/ice-shards";

export const SHARD_DEPTH = 0.09;

export interface ShardBody {
  geometry: ExtrudeGeometry;
  outline: BufferGeometry;
  /** Resting world position of the shard's centre (front face at z = 0). */
  origin: Vector3;
  direction: Vector2;
  ring: number;
  /** 0 at the impact point, 1 at the farthest shard: drives crack timing. */
  reach: number;
}

/**
 * Converts the 2D fracture pattern (viewport pixels) into thick ice shards
 * that exactly tile a `width` × `height` world plane. Front-face UVs map to
 * screen space, so together the shards show the frozen frame seamlessly.
 */
export function createShardBodies(
  pattern: IcePattern,
  viewport: { width: number; height: number },
  plane: { width: number; height: number },
): ShardBody[] {
  const toWorld = (p: { x: number; y: number }) =>
    new Vector2(
      (p.x / viewport.width - 0.5) * plane.width,
      (0.5 - p.y / viewport.height) * plane.height,
    );
  const impact = toWorld(pattern.impact);
  const distances = pattern.shards.map((shard) => {
    const sum = shard.points.reduce<Vector2>(
      (acc, p) => acc.add(toWorld(p)),
      new Vector2(),
    );
    return sum.divideScalar(shard.points.length);
  });
  const farthest = Math.max(
    ...distances.map((c) => c.distanceTo(impact)),
    1e-3,
  );

  return pattern.shards.map((shard, index) => {
    const centre = distances[index];
    const local = shard.points.map((p) => toWorld(p).sub(centre));
    const geometry = new ExtrudeGeometry(new Shape(local), {
      depth: SHARD_DEPTH,
      bevelEnabled: false,
    });
    geometry.translate(0, 0, -SHARD_DEPTH);

    const positions = geometry.getAttribute("position");
    const uvs = new Float32Array(positions.count * 2);
    for (let i = 0; i < positions.count; i += 1) {
      uvs[i * 2] = (positions.getX(i) + centre.x) / plane.width + 0.5;
      uvs[i * 2 + 1] = (positions.getY(i) + centre.y) / plane.height + 0.5;
    }
    geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));

    const outline = new BufferGeometry().setFromPoints(
      [...local, local[0]].map((p) => new Vector3(p.x, p.y, 0.002)),
    );

    return {
      geometry,
      outline,
      origin: new Vector3(centre.x, centre.y, 0),
      direction: new Vector2(shard.direction.x, -shard.direction.y),
      ring: shard.ring,
      reach: centre.distanceTo(impact) / farthest,
    };
  });
}
