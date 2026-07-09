export type ActiveTool = "none" | "crop" | "resize" | "filter";

export type FilterPreset =
  | "none"
  | "grayscale"
  | "sepia"
  | "vintage"
  | "warm"
  | "cool"
  | "vivid"
  | "dramatic"
  | "cinematic"
  | "cyberpunk"
  | "golden"
  | "noir"
  | "matte"
  | "lomo"
  | "retro"
  | "rosy"
  | "forest"
  | "invert"
  | "fade"
  | "solarize"
  | "noise"
  | "winter";

export interface FiltersState {
  brightness: number; // Range: -1 to 1, default 0
  contrast: number; // Range: -100 to 100, default 0
  blur: number; // Range: 0 to 40, default 0
  preset: FilterPreset;
}

export interface CropConfig {
  aspect: number | null; // e.g. 1, 16/9, 4/3, or null for Free
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeConfig {
  width: number;
  height: number;
  lockAspectRatio: boolean;
}

export interface HistoryState {
  src: string;
  width: number;
  height: number;
  filters: FiltersState;
}
