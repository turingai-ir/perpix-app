import { useQuery } from "@tanstack/react-query";
import { listPresets } from "../services/presets";

export function usePresets() {
  return useQuery({
    queryKey: ["studio", "caption-presets"],
    queryFn: ({ signal }) => listPresets(signal),
    staleTime: 5 * 60_000,
  });
}
