import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type PointsMaterial,
  type Vector2,
} from "three";

import { CRACK_SECONDS } from "./ice-shards";

const DUST_TINTS = ["#ffffff", "#d8f3ff", "#35c8ff", "#e9c9ff"].map(
  (hex) => new Color(hex),
);

function createDust(count: number) {
  const geometry = new BufferGeometry();
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 4.5;
    velocities.set(
      [Math.cos(angle) * speed, Math.sin(angle) * speed, 1 + Math.random() * 6],
      i * 3,
    );
    const tint = DUST_TINTS[i % DUST_TINTS.length];
    colors.set([tint.r, tint.g, tint.b], i * 3);
  }
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(count * 3), 3),
  );
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return { geometry, velocities };
}

/** Glittering ice dust blown out of the impact point as the sheet breaks. */
export function IceDust({ impact, count }: { impact: Vector2; count: number }) {
  const material = useRef<PointsMaterial>(null);
  const start = useRef<number | null>(null);
  const dust = useMemo(() => createDust(count), [count]);

  useFrame(({ clock }) => {
    start.current ??= clock.elapsedTime;
    const t = Math.max(
      0,
      clock.elapsedTime - start.current - CRACK_SECONDS * 0.6,
    );
    const position = dust.geometry.getAttribute("position");
    for (let i = 0; i < count; i += 1) {
      position.setXYZ(
        i,
        impact.x + dust.velocities[i * 3] * t,
        impact.y + dust.velocities[i * 3 + 1] * t - 2.2 * t * t,
        dust.velocities[i * 3 + 2] * t,
      );
    }
    position.needsUpdate = true;
    if (material.current)
      material.current.opacity = t > 0 ? Math.max(0, 1 - t / 1.3) : 0;
  });

  return (
    <points geometry={dust.geometry}>
      <pointsMaterial
        ref={material}
        size={0.05}
        vertexColors
        transparent
        opacity={0}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
