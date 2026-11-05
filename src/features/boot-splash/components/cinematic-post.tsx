import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Vector2 } from "three";

const LENS_FRINGE = new Vector2(0.0011, 0.0007);

/**
 * Film look: HDR bloom on emissive parts only (threshold above 1), lens
 * fringing, film grain and vignette, then a single ACES tone-map at the end.
 */
export function CinematicPost({ lite }: { lite: boolean }) {
  if (lite) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.9} radius={0.7} />
        <Vignette offset={0.3} darkness={0.65} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        luminanceThreshold={1}
        luminanceSmoothing={0.2}
        intensity={1.25}
        radius={0.78}
      />
      <ChromaticAberration
        offset={LENS_FRINGE}
        radialModulation
        modulationOffset={0.35}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.35}
      />
      <Vignette offset={0.28} darkness={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
