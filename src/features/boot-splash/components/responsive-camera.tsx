import { useFrame } from "@react-three/fiber";
import { Fog } from "three";

import { clashAge } from "../model/choreography";
import { BRAND_SPECTRUM } from "../model/palette";
import { sceneClock } from "./scene-time";

/** Half the width (world units) that must stay in frame: both fighters. */
const STAGE_HALF_WIDTH = 3.4;
const BASE_DISTANCE = 7;
const HALF_FOV_TAN = Math.tan((40 / 2) * (Math.PI / 180));

/**
 * Cinematic rig: slow orbit around the stage, a push-in on every clash with
 * impact shake, pulled back on narrow (portrait) screens so nobody is cut off.
 */
export function ResponsiveCamera() {
  useFrame(({ camera, scene, size }) => {
    const aspect = size.width / size.height;
    const base = Math.max(
      BASE_DISTANCE,
      STAGE_HALF_WIDTH / (HALF_FOV_TAN * aspect),
    );
    const t = sceneClock.time;
    const age = clashAge(t);
    const push = Math.exp(-age * 2.5) * 0.12;
    const distance = base * (1 - push);
    const orbit = Math.sin(t * 0.32) * 0.3;
    const shake = 0.1 * Math.max(0, 1 - age / 0.4) ** 2;

    camera.position.set(
      Math.sin(orbit) * distance + Math.sin(t * 90) * shake,
      0.75 + Math.sin(t * 0.5) * 0.15 + Math.cos(t * 73) * shake,
      Math.cos(orbit) * distance,
    );
    camera.lookAt(0, 0.2, 0);
    camera.rotation.z += Math.sin(t * 0.4) * 0.015;

    if (!scene.fog) {
      scene.fog = new Fog(BRAND_SPECTRUM.night, base + 2, base + 16);
    }
  });

  return null;
}
