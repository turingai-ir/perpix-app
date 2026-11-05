import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, Vector2 } from "three";

import { createIcePattern } from "../model/ice-shards";
import { IceDust } from "./ice-dust";
import { createShardBodies } from "./ice-shard-geometry";
import { IceShards, SHATTER_SECONDS } from "./ice-shards";

const CAMERA_Z = 10;
const FOV = 35;

interface IceShatter3DProps {
  /** Frozen frame of the fight (a 2D copy of the WebGL canvas). */
  snapshot: HTMLCanvasElement;
  lite: boolean;
  onFirstFrame: () => void;
  onDone: () => void;
}

/** Ends the shatter and adds a slow cinematic push-in. */
function Director({ onDone }: { onDone: () => void }) {
  const start = useRef<number | null>(null);
  const finished = useRef(false);

  useFrame(({ clock, camera }) => {
    start.current ??= clock.elapsedTime;
    const t = clock.elapsedTime - start.current;
    camera.position.z = CAMERA_Z - Math.min(1, t / SHATTER_SECONDS) ** 2 * 0.8;
    if (!finished.current && t >= SHATTER_SECONDS) {
      finished.current = true;
      onDone();
    }
  });

  return null;
}

/**
 * Real 3D ice break: the frozen frame becomes a sheet of thick ice shards
 * that crack from the impact, then explode towards the camera and fall,
 * revealing the app through a transparent canvas.
 */
export default function IceShatter3D({
  snapshot,
  lite,
  onFirstFrame,
  onDone,
}: IceShatter3DProps) {
  const scene = useMemo(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const height = 2 * CAMERA_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
    const plane = {
      width: height * (viewport.width / viewport.height),
      height,
    };
    const pattern = createIcePattern(viewport.width, viewport.height);
    const texture = new CanvasTexture(snapshot);
    texture.colorSpace = SRGBColorSpace;
    return {
      texture,
      bodies: createShardBodies(pattern, viewport, plane),
      impact: new Vector2(
        (pattern.impact.x / viewport.width - 0.5) * plane.width,
        (0.5 - pattern.impact.y / viewport.height) * plane.height,
      ),
    };
  }, [snapshot]);

  useEffect(() => () => scene.texture.dispose(), [scene]);

  return (
    <Canvas
      className="!absolute inset-0"
      data-ice-shatter
      dpr={lite ? 1 : [1, 1.75]}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
      gl={{ alpha: true, antialias: !lite }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        requestAnimationFrame(onFirstFrame);
      }}
      aria-hidden="true"
    >
      <Director onDone={onDone} />
      <IceShards bodies={scene.bodies} snapshot={scene.texture} />
      <IceDust impact={scene.impact} count={lite ? 160 : 420} />
    </Canvas>
  );
}
