import { useMemo } from "react";
import Konva from "konva";

import type { FiltersState } from "../_model/types";
import { getPresetFilter } from "../_services/filter-effects";

export function useEditorKonvaFilters(filters: FiltersState) {
  return useMemo(() => {
    const presetFilter = getPresetFilter(filters.preset);

    return [
      ...(filters.brightness !== 0 ? [Konva.Filters.Brighten] : []),
      ...(filters.contrast !== 0 ? [Konva.Filters.Contrast] : []),
      ...(filters.blur > 0 ? [Konva.Filters.Blur] : []),
      ...(presetFilter ? [presetFilter] : []),
    ];
  }, [filters.blur, filters.brightness, filters.contrast, filters.preset]);
}
