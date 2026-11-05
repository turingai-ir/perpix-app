import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Points,
} from "three";

import { FIGHTER_COLORS } from "../model/palette";

const HEIGHT = 7;

function createEmbers(count: number) {
  const geometry = new BufferGeometry();
  const seeds = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const left = new Color(FIGHTER_COLORS.left.tip);
  const right = new Color(FIGHTER_COLORS.right.tip);
  for (let i = 0; i < count; i += 1) {
    const x = (Math.random() - 0.5) * 14;
    seeds.set([x, Math.random() * HEIGHT, -4 + Math.random() * 6], i * 3);
    const tint = (x < 0 ? left : right)
      .clone()
      .multiplyScalar(1.6 + Math.random() * 1.6);
    colors.set([tint.r, tint.g, tint.b], i * 3);
  }
  geometry.setAttribute("position", new BufferAttribute(seeds.slice(), 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return { geometry, seeds };
}

/** Glowing embers rising through the arena, tinted by each fighter's side. */
export function Embers({ count }: { count: number }) {
  const points = useRef<Points>(null);
  const embers = useMemo(() => createEmbers(count), [count]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const position = embers.geometry.getAttribute("position");
    for (let i = 0; i < count; i += 1) {
      const x = embers.seeds[i * 3];
      const y =
        (embers.seeds[i * 3 + 1] + t * (0.35 + (i % 7) * 0.06)) % HEIGHT;
      position.setXYZ(
        i,
        x + Math.sin(t * 0.8 + i) * 0.25,
        y - 1.5,
        embers.seeds[i * 3 + 2],
      );
    }
    position.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={embers.geometry}>
      <pointsMaterial
        size={0.045}
        vertexColors
        toneMapped={false}
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
