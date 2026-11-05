import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Object3D,
  type InstancedMesh,
  type MeshBasicMaterial,
} from "three";

import { clashAge } from "../model/choreography";
import { GLYPH_CENTRE, P_TRACES } from "../model/circuit-traces";
import { sceneClock } from "./scene-time";

const FRONT_Z = 0.335;
const segments = P_TRACES.flatMap((trace) =>
  trace.slice(1).map((end, i) => [trace[i], end] as const),
);
const nodes = P_TRACES.flatMap((trace) => [trace[0], trace[trace.length - 1]]);

/** Glowing circuit traces on the fighter's face; flare on every clash. */
export function CircuitOverlay({ color }: { color: string }) {
  const lines = useRef<InstancedMesh>(null);
  const pads = useRef<InstancedMesh>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const hdr = useMemo(() => new Color(color), [color]);

  useLayoutEffect(() => {
    const dummy = new Object3D();
    segments.forEach(([[x1, y1], [x2, y2]], i) => {
      dummy.position.set(
        (x1 + x2) / 2 - GLYPH_CENTRE.x,
        (y1 + y2) / 2 - GLYPH_CENTRE.y,
        FRONT_Z,
      );
      dummy.rotation.set(0, 0, Math.atan2(y2 - y1, x2 - x1));
      dummy.scale.set(Math.hypot(x2 - x1, y2 - y1) + 0.02, 0.035, 0.02);
      dummy.updateMatrix();
      lines.current?.setMatrixAt(i, dummy.matrix);
    });
    nodes.forEach(([x, y], i) => {
      dummy.position.set(x - GLYPH_CENTRE.x, y - GLYPH_CENTRE.y, FRONT_Z);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      pads.current?.setMatrixAt(i, dummy.matrix);
    });
    if (lines.current) lines.current.instanceMatrix.needsUpdate = true;
    if (pads.current) pads.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!material.current) return;
    const flare = Math.max(0, 1 - clashAge(sceneClock.time) / 0.5);
    const pulse = 1.8 + Math.sin(sceneClock.time * 5) * 0.35 + flare * 4;
    material.current.color.copy(hdr).multiplyScalar(pulse);
  });

  return (
    <>
      <instancedMesh ref={lines} args={[undefined, undefined, segments.length]}>
        <boxGeometry />
        <meshBasicMaterial ref={material} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={pads} args={[undefined, undefined, nodes.length]}>
        <cylinderGeometry args={[0.055, 0.055, 0.03, 16]} />
        <meshBasicMaterial
          color={hdr.clone().multiplyScalar(2.6)}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
