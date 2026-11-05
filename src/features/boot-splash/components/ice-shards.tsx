import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  type CanvasTexture,
  type Group,
  type LineBasicMaterial,
  type MeshBasicMaterial,
} from "three";

import type { ShardBody } from "./ice-shard-geometry";

/** Seconds for the crack to run from the impact to the farthest shard. */
export const CRACK_SECONDS = 0.34;
export const SHATTER_SECONDS = 1.75;
const GRAVITY = 7.5;
const ICE_TINT = new Color(1.12, 1.18, 1.3);

interface Flight {
  delay: number;
  velocity: [number, number, number];
  spin: [number, number, number];
}

function planFlight(body: ShardBody): Flight {
  const burst = 1.4 + body.ring * 1.1 + Math.random() * 0.9;
  return {
    delay: CRACK_SECONDS + body.ring * 0.05 + Math.random() * 0.05,
    velocity: [
      body.direction.x * burst,
      body.direction.y * burst + 1.2,
      2.2 + Math.random() * 4.2,
    ],
    spin: [0, 1, 2].map(() => (Math.random() - 0.5) * 9) as Flight["spin"],
  };
}

/** Frozen-frame ice sheet that cracks open and explodes towards the camera. */
export function IceShards({
  bodies,
  snapshot,
}: {
  bodies: ShardBody[];
  snapshot: CanvasTexture;
}) {
  const groups = useRef<(Group | null)[]>([]);
  const faces = useRef<(MeshBasicMaterial | null)[]>([]);
  const edges = useRef<(LineBasicMaterial | null)[]>([]);
  const flights = useMemo(() => bodies.map(planFlight), [bodies]);
  const start = useRef<number | null>(null);

  useEffect(
    () => () =>
      bodies.forEach((body) => {
        body.geometry.dispose();
        body.outline.dispose();
      }),
    [bodies],
  );

  useFrame(({ clock }) => {
    start.current ??= clock.elapsedTime;
    const t = clock.elapsedTime - start.current;

    bodies.forEach((body, i) => {
      const group = groups.current[i];
      if (!group) return;
      const flight = flights[i];
      const cracked = Math.min(
        1,
        Math.max(0, (t - body.reach * CRACK_SECONDS) / 0.08),
      );
      const local = t - flight.delay;
      const fade = local > 0.75 ? Math.max(0, 1 - (local - 0.75) / 0.55) : 1;

      if (local <= 0) {
        // Shards tremble in place once the crack has reached them.
        const tremble = cracked * 0.006;
        group.position.set(
          body.origin.x + Math.sin(t * 70 + i) * tremble,
          body.origin.y + Math.cos(t * 63 + i) * tremble,
          0,
        );
      } else {
        const [vx, vy, vz] = flight.velocity;
        group.position.set(
          body.origin.x + vx * local,
          body.origin.y + vy * local - 0.5 * GRAVITY * local * local,
          vz * local,
        );
        group.rotation.set(
          flight.spin[0] * local,
          flight.spin[1] * local,
          flight.spin[2] * local,
        );
      }

      const face = faces.current[i];
      if (face) face.opacity = fade;
      const edge = edges.current[i];
      if (edge) edge.opacity = cracked * fade;
    });
  });

  return bodies.map((body, i) => (
    <group
      key={i}
      ref={(node) => void (groups.current[i] = node)}
      position={body.origin}
    >
      <mesh geometry={body.geometry}>
        <meshBasicMaterial
          ref={(node) => void (faces.current[i] = node)}
          attach="material-0"
          map={snapshot}
          color={ICE_TINT}
          toneMapped={false}
          transparent
        />
        <meshBasicMaterial
          attach="material-1"
          color="#d8f3ff"
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      <lineLoop>
        <primitive object={body.outline} attach="geometry" />
        <lineBasicMaterial
          ref={(node) => void (edges.current[i] = node)}
          color="#f2fbff"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </lineLoop>
    </group>
  ));
}
