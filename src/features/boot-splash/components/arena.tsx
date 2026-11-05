import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Object3D,
  type InstancedMesh,
  type ShaderMaterial,
} from "three";

import { BRAND_SPECTRUM } from "../model/palette";

const TOWERS = 46;

const skyShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uLeft;
    uniform vec3 uRight;
    uniform vec3 uNight;
    uniform float uFlash;
    varying vec2 vUv;
    void main() {
      // Work in world units of the 120 × 60 plane centred at y = 2.
      vec2 p = vec2((vUv.x - 0.5) * 120.0, vUv.y * 60.0 - 28.0);
      float seam = p.x + (p.y - 2.0) * 0.35;
      vec3 side = mix(uLeft, uRight, smoothstep(-3.7, 3.7, seam));
      float glow = smoothstep(18.0, 0.0, abs(p.y + 0.9)) * 0.75;
      float core = 1.0 - smoothstep(0.0, 3.7, abs(seam));
      vec3 color = mix(uNight, side, glow) + side * core * 0.35;
      color += vec3(0.75, 0.8, 1.0) * uFlash * (0.35 + clamp((p.y + 10.0) / 24.0, 0.0, 1.0) * 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

/** Stormy split sky, night skyline and a polished floor in logo colours. */
export function Arena() {
  const sky = useRef<ShaderMaterial>(null);
  const towers = useRef<InstancedMesh>(null);
  const uniforms = useMemo(
    () => ({
      uLeft: { value: new Color(BRAND_SPECTRUM.magenta) },
      uRight: { value: new Color(BRAND_SPECTRUM.blue) },
      uNight: { value: new Color(BRAND_SPECTRUM.night) },
      uFlash: { value: 0 },
    }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = towers.current;
    if (!mesh) return;
    const dummy = new Object3D();
    for (let i = 0; i < TOWERS; i += 1) {
      const height = 0.8 + ((i * 37) % 11) * 0.32 + (i % 3) * 0.4;
      dummy.position.set(
        -11 + (i / TOWERS) * 22,
        -1.55 + height / 2,
        -6 - (i % 4),
      );
      dummy.scale.set(0.35 + (i % 5) * 0.12, height, 0.4);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    if (!sky.current) return;
    // Double lightning strike roughly every 3.7 seconds.
    const t = clock.elapsedTime % 3.7;
    const strike =
      Math.max(0, 1 - Math.abs(t - 2.9) * 18) +
      Math.max(0, 1 - Math.abs(t - 3.05) * 14) * 0.7;
    sky.current.uniforms.uFlash.value = strike;
  });

  return (
    <>
      <mesh position={[0, 2, -12]}>
        <planeGeometry args={[120, 60]} />
        <shaderMaterial ref={sky} args={[{ uniforms, ...skyShader }]} />
      </mesh>
      <instancedMesh ref={towers} args={[undefined, undefined, TOWERS]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#0d0e18"
          roughness={0.9}
          envMapIntensity={0.06}
          emissive={BRAND_SPECTRUM.violet}
          emissiveIntensity={0.05}
        />
      </instancedMesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.55, 0]}
        receiveShadow
      >
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial
          color="#05050a"
          metalness={0.9}
          roughness={0.3}
          envMapIntensity={0.05}
        />
      </mesh>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[-4, 5, 3]}
        intensity={1.4}
        color={BRAND_SPECTRUM.magenta}
      />
      <directionalLight
        position={[4, 5, 3]}
        intensity={1.4}
        color={BRAND_SPECTRUM.cyan}
      />
    </>
  );
}
