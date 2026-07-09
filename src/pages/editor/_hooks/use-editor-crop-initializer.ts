import { useEffect } from "react";
import type { SetStateAction } from "jotai";

import type { ActiveTool, CropConfig } from "../_model/types";

interface EditorCropInitializerParams {
  activeTool: ActiveTool;
  cropConfig: CropConfig;
  currentDimensions: { width: number; height: number };
  imageElement: HTMLImageElement | null;
  setCropConfig: (value: SetStateAction<CropConfig>) => void;
}

export function useEditorCropInitializer({
  activeTool,
  cropConfig,
  currentDimensions,
  imageElement,
  setCropConfig,
}: EditorCropInitializerParams) {
  useEffect(() => {
    if (activeTool !== "crop" || cropConfig.width !== 0 || !imageElement) {
      return;
    }

    setCropConfig({
      aspect: null,
      x: 0,
      y: 0,
      width: currentDimensions.width,
      height: currentDimensions.height,
    });
  }, [
    activeTool,
    cropConfig.width,
    currentDimensions,
    imageElement,
    setCropConfig,
  ]);
}
