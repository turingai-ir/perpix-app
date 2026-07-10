import { useState } from "react";
import { CROP_RATIO_OPTIONS, type CropRatioId } from "../_model/crop-ratios";
import type { CropArea } from "../_model/crop-area";

const FULL_AREA: CropArea = { height: 1, width: 1, x: 0, y: 0 };

export function useImageCrop() {
  const [draftCrop, setDraftCrop] = useState<CropArea>(FULL_AREA);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<CropRatioId>("free");
  const selectedRatioValue = CROP_RATIO_OPTIONS.find(
    (ratio) => ratio.id === selectedRatio,
  )?.value;

  const beginCrop = () => {
    setDraftCrop(FULL_AREA);
    setSelectedRatio("free");
    setIsCropping(true);
  };

  const selectRatio = (ratioId: CropRatioId, stageRatio: number) => {
    const ratio = CROP_RATIO_OPTIONS.find((option) => option.id === ratioId);
    if (!ratio) return;
    setSelectedRatio(ratioId);
    if (!ratio.value) {
      setDraftCrop(FULL_AREA);
      return;
    }
    if (ratio.value > stageRatio) {
      const height = stageRatio / ratio.value;
      setDraftCrop({ height, width: 1, x: 0, y: (1 - height) / 2 });
      return;
    }
    const width = ratio.value / stageRatio;
    setDraftCrop({ height: 1, width, x: (1 - width) / 2, y: 0 });
  };

  const applyCrop = (appliedCrop: CropArea): CropArea => {
    const nextCrop = {
      height: appliedCrop.height * draftCrop.height,
      width: appliedCrop.width * draftCrop.width,
      x: appliedCrop.x + appliedCrop.width * draftCrop.x,
      y: appliedCrop.y + appliedCrop.height * draftCrop.y,
    };
    setIsCropping(false);
    return nextCrop;
  };

  return {
    applyCrop,
    beginCrop,
    cancelCrop: () => setIsCropping(false),
    draftCrop,
    isCropping,
    selectedRatio,
    selectedRatioValue,
    selectRatio,
    setDraftCrop,
  };
}
