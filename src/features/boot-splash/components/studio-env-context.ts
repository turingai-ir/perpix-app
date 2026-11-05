import { createContext, useContext } from "react";
import type { Texture } from "three";

export const StudioEnvContext = createContext<Texture | null>(null);

/** Studio reflection map for chrome materials (null outside the scene). */
export function useStudioEnv() {
  return useContext(StudioEnvContext);
}
