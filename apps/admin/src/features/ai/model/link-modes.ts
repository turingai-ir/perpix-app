import type { AiRegistryModelProviderLinkDetail } from "./types";

/** `_shared` holds settings common to every mode; it is not a mode itself. */
const SHARED_KEY = "_shared";

/** Modes the link can serve (keys of `modes`). */
export const servedModes = (
  link: Pick<AiRegistryModelProviderLinkDetail, "modes">,
): string[] => Object.keys(link.modes).filter((mode) => mode !== SHARED_KEY);

/** Served modes that are not switched on, so new requests for them are refused. */
export const switchedOffModes = (
  link: Pick<AiRegistryModelProviderLinkDetail, "modes" | "workflow_modes">,
): string[] => {
  const on = new Set(link.workflow_modes ?? []);
  return servedModes(link).filter((mode) => !on.has(mode));
};
