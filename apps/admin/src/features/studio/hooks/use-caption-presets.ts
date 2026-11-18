import { useReactQueryApi } from "@/hooks";

/** The admin's presets in display order, hidden ones included. */
export function useCaptionPresets() {
  const api = useReactQueryApi();

  return api.useQuery(
    "get",
    "/api/admin/v1/studio/caption-presets",
    {},
    { placeholderData: (previous) => previous, staleTime: 30_000 },
  );
}
