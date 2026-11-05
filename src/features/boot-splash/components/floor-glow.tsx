import { useMemo } from "react";
import { AdditiveBlending, Color } from "three";

import { BRAND_SPECTRUM } from "../model/palette";

const glowShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      float falloff = 1.0 - smoothstep(0.0, 0.5, length(vUv - 0.5));
      gl_FragColor = vec4(uColor * falloff * falloff * uStrength, 1.0);
    }
  `,
};

function Glow({
  color,
  x,
  size,
  strength,
}: {
  color: string;
  x: number;
  size: [number, number];
  strength: number;
}) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uStrength: { value: strength },
    }),
    [color, strength],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.53, 0.4]}>
      <planeGeometry args={size} />
      <shaderMaterial
        args={[{ uniforms, ...glowShader }]}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

/** Coloured light pools on the floor under each fighter and the clash point. */
export function FloorGlow() {
  return (
    <>
      <Glow
        color={BRAND_SPECTRUM.magenta}
        x={-1.9}
        size={[7, 4]}
        strength={0.9}
      />
      <Glow color={BRAND_SPECTRUM.cyan} x={1.9} size={[7, 4]} strength={0.8} />
      <Glow color={BRAND_SPECTRUM.violet} x={0} size={[3, 6]} strength={0.7} />
    </>
  );
}
