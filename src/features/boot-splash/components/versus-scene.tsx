import { Canvas } from "@react-three/fiber";
import { NoToneMapping } from "three";

import { BRAND_SPECTRUM } from "../model/palette";
import { Arena } from "./arena";
import { CinematicPost } from "./cinematic-post";
import { ClashEffects } from "./clash-effects";
import { Embers } from "./embers";
import { Fighter } from "./fighter";
import { FloorGlow } from "./floor-glow";
import { ResponsiveCamera } from "./responsive-camera";
import { SceneClock } from "./scene-clock";
import { StudioEnvironment } from "./studio-environment";

interface VersusSceneProps {
  lite: boolean;
  /** Called after the first frame so the splash can swap in the live scene. */
  onFirstFrame: (canvas: HTMLCanvasElement) => void;
}

/** Lazy-loaded WebGL fight between the two logo "P"s. */
export default function VersusScene({ lite, onFirstFrame }: VersusSceneProps) {
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 2]}
      camera={{ position: [0, 0.75, 7], fov: 40 }}
      gl={{
        antialias: false,
        preserveDrawingBuffer: true,
        alpha: false,
        // The post chain owns tone mapping (single ACES pass at the end).
        toneMapping: NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(BRAND_SPECTRUM.night);
        requestAnimationFrame(() => onFirstFrame(gl.domElement));
      }}
      aria-hidden="true"
    >
      <SceneClock />
      <ResponsiveCamera />
      <Arena />
      <FloorGlow />
      <Embers count={lite ? 120 : 320} />
      <StudioEnvironment>
        <Fighter side="left" />
        <Fighter side="right" />
      </StudioEnvironment>
      <ClashEffects sparkCount={lite ? 70 : 220} />
      <CinematicPost lite={lite} />
    </Canvas>
  );
}
