import { atom } from "jotai";
import type {
  ActiveTool,
  FiltersState,
  CropConfig,
  ResizeConfig,
  HistoryState,
} from "../_model/types";

export const initialFilters: FiltersState = {
  brightness: 0,
  contrast: 0,
  blur: 0,
  preset: "none",
};

export const srcImageAtom = atom<string | null>(null);
export const originalDimensionsAtom = atom<{ width: number; height: number }>({
  width: 0,
  height: 0,
});
export const currentDimensionsAtom = atom<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

export const activeToolAtom = atom<ActiveTool>("none");
export const filtersAtom = atom<FiltersState>({ ...initialFilters });

export const cropConfigAtom = atom<CropConfig>({
  aspect: null,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

export const resizeConfigAtom = atom<ResizeConfig>({
  width: 0,
  height: 0,
  lockAspectRatio: true,
});

export const zoomAtom = atom<number>(1);
export const panAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });

export const historyAtom = atom<HistoryState[]>([]);
export const historyIndexAtom = atom<number>(-1);

export const savingAtom = atom<boolean>(false);
export const loadingAtom = atom<boolean>(true);
export const errorAtom = atom<string | null>(null);
