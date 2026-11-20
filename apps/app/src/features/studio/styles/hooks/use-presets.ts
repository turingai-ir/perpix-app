import { useQuery } from "@tanstack/react-query";
import { listPresets } from "../services/presets";

export const presetsKey = ["studio", "caption-presets"] as const;

export function usePresets() {
  return useQuery({
    queryKey: presetsKey,
    queryFn: ({ signal }) => listPresets(signal),
    staleTime: 5 * 60_000,
  });
}
