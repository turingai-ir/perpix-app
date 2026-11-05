import { useEffect, useMemo, type PropsWithChildren } from "react";
import { useThree } from "@react-three/fiber";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { StudioEnvContext } from "./studio-env-context";

/**
 * Procedural studio reflections for the chrome fighter parts only; the night
 * arena stays dark because the map is not set as the scene environment.
 */
export function StudioEnvironment({ children }: PropsWithChildren) {
  const gl = useThree((state) => state.gl);
  const texture = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    return target;
  }, [gl]);

  useEffect(() => () => texture.dispose(), [texture]);

  return <StudioEnvContext value={texture}>{children}</StudioEnvContext>;
}
