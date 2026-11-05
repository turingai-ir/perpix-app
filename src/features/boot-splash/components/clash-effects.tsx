import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type PointLight,
  type Points,
} from "three";

import { clashAge } from "../model/choreography";
import { BRAND_SPECTRUM } from "../model/palette";
import { sceneClock } from "./scene-time";

const SPARK_LIFE = 0.6;
const spectrum = [
  BRAND_SPECTRUM.magenta,
  BRAND_SPECTRUM.violet,
  BRAND_SPECTRUM.blue,
  BRAND_SPECTRUM.cyan,
  "#ffffff",
].map((hex) => new Color(hex));

function createSparks(count: number) {
  const geometry = new BufferGeometry();
  const colors = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 4;
    velocities.set(
      [
        Math.cos(angle) * speed,
        Math.sin(angle) * speed * 0.8 + 1.2,
        (Math.random() - 0.3) * 3,
      ],
      i * 3,
    );
    // HDR values above 1 so the bloom pass picks the sparks up.
    const color = spectrum[i % spectrum.length];
    colors.set([color.r * 3, color.g * 3, color.b * 3], i * 3);
  }
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(count * 3), 3),
  );
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return { geometry, velocities };
}

/** Spark burst and impact light at every clash. */
export function ClashEffects({ sparkCount }: { sparkCount: number }) {
  const points = useRef<Points>(null);
  const flash = useRef<PointLight>(null);
  const sparks = useMemo(() => createSparks(sparkCount), [sparkCount]);

  useFrame(() => {
    const age = clashAge(sceneClock.time);
    const energy = Math.max(0, 1 - age / SPARK_LIFE);

    const position = sparks.geometry.getAttribute("position");
    for (let i = 0; i < sparkCount; i += 1) {
      const vx = sparks.velocities[i * 3];
      const vy = sparks.velocities[i * 3 + 1];
      const vz = sparks.velocities[i * 3 + 2];
      position.setXYZ(i, vx * age, 0.35 + vy * age - 4.9 * age * age, vz * age);
    }
    position.needsUpdate = true;
    if (points.current) points.current.visible = energy > 0;
    if (flash.current) flash.current.intensity = 28 * energy * energy;
  });

  return (
    <>
      <points ref={points} geometry={sparks.geometry}>
        <pointsMaterial
          size={0.09}
          vertexColors
          toneMapped={false}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight
        ref={flash}
        position={[0, 0.7, 0.8]}
        color="#efe4ff"
        distance={4.5}
      />
    </>
  );
}
