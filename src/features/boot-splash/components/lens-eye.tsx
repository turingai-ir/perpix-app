import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, type Group } from "three";

import { ROUND_SECONDS } from "../model/choreography";
import { P_EYE } from "./p-glyph-geometry";
import { sceneClock } from "./scene-time";
import { useStudioEnv } from "./studio-env-context";

const BLADES = 6;

/**
 * Mechanical lens eye in the bowl of the "P": a bezel that unscrews and
 * spins out once per round while the iris blades rotate.
 */
export function LensEye({ color, offset }: { color: string; offset: number }) {
  const bezel = useRef<Group>(null);
  const iris = useRef<Group>(null);
  const envMap = useStudioEnv();
  const hot = useMemo(() => new Color(color).multiplyScalar(3.2), [color]);

  useFrame(() => {
    const t = sceneClock.time + offset;
    const u = (t % ROUND_SECONDS) / ROUND_SECONDS;
    // Unscrew between 15% and 45% of each round, then screw back in.
    const open = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - 0.15) / 0.3)));
    if (bezel.current) {
      bezel.current.position.z = 0.36 + open * 0.22;
      bezel.current.rotation.z = -open * Math.PI * 1.5;
    }
    if (iris.current) iris.current.rotation.z = t * 1.4;
  });

  return (
    <group position={[P_EYE.x, P_EYE.y, 0]}>
      <mesh>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial color={hot} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <group ref={iris} position={[0, 0, 0.18]}>
        {Array.from({ length: BLADES }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i / BLADES) * Math.PI * 2]}
            position={[
              Math.cos((i / BLADES) * Math.PI * 2) * 0.24,
              Math.sin((i / BLADES) * Math.PI * 2) * 0.24,
              0,
            ]}
          >
            <boxGeometry args={[0.16, 0.035, 0.02]} />
            <meshStandardMaterial
              envMap={envMap}
              color="#20202c"
              metalness={1}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>
      <group ref={bezel}>
        <mesh>
          <torusGeometry args={[0.36, 0.045, 16, 48]} />
          <meshPhysicalMaterial
            envMap={envMap}
            color="#c9c9d6"
            metalness={1}
            roughness={0.15}
            clearcoat={1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.43, 0.012, 8, 48]} />
          <meshBasicMaterial color={hot} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
