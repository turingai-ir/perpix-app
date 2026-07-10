export type CropRatioId = "free" | "1:1" | "3:4" | "16:9" | "4:3" | "9:16";

export interface CropRatioOption {
  id: CropRatioId;
  label: string;
  value: number | null;
}

export const CROP_RATIO_OPTIONS: CropRatioOption[] = [
  { id: "free", label: "FreeSize", value: null },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "3:4", label: "3:4", value: 3 / 4 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
];
