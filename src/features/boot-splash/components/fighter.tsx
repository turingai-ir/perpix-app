import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, EdgesGeometry, type Group } from "three";

import { fighterPose, type FighterSide } from "../model/choreography";
import { FIGHTER_COLORS } from "../model/palette";
import { CircuitOverlay } from "./circuit-overlay";
import { LensEye } from "./lens-eye";
import { createPGlyphGeometry } from "./p-glyph-geometry";
import { sceneClock } from "./scene-time";
import { useStudioEnv } from "./studio-env-context";

/** One logo "P" fighter; animates through refs so React never re-renders. */
export function Fighter({ side }: { side: FighterSide }) {
  const colors = FIGHTER_COLORS[side];
  const group = useRef<Group>(null);
  const envMap = useStudioEnv();
  const geometry = useMemo(() => createPGlyphGeometry(colors), [colors]);
  const edges = useMemo(() => new EdgesGeometry(geometry, 24), [geometry]);
  // The right fighter is mirrored so both bowls face the opponent.
  const facing = side === "left" ? 1 : -1;

  useEffect(
    () => () => {
      geometry.dispose();
      edges.dispose();
    },
    [geometry, edges],
  );

  useFrame(() => {
    const node = group.current;
    if (!node) return;
    const pose = fighterPose(sceneClock.time, side);
    node.position.set(pose.x, pose.y - 0.15, 0);
    node.rotation.set(0, pose.turn, pose.lean);
  });

  return (
    <group ref={group}>
      <group scale={[facing * 0.78, 0.78, 0.78]}>
        <mesh geometry={geometry} castShadow>
          <meshPhysicalMaterial
            vertexColors
            metalness={0.85}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMap={envMap}
            envMapIntensity={1.4}
            emissive={colors.glow}
            emissiveIntensity={0.12}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial
            color={colors.tip}
            transparent
            opacity={0.7}
            blending={AdditiveBlending}
          />
        </lineSegments>
        <CircuitOverlay color={colors.tip} />
        <LensEye color={colors.glow} offset={side === "left" ? 0 : 1.3} />
      </group>
      <pointLight
        color={colors.glow}
        intensity={6}
        distance={5}
        position={[0, 0.4, 1.2]}
      />
    </group>
  );
}
