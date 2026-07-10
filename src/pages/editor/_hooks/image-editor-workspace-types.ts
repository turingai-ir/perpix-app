import type Konva from "konva";
import type { AlignmentGuide } from "../_model/image-alignment";
import type { CropArea, CropDisplayOrigin } from "../_model/crop-area";
import type { CropRatioId } from "../_model/crop-ratios";

export interface DisplaySize {
  height: number;
  width: number;
}

export interface ImageEditorWorkspaceViewModel {
  alignmentGuides: AlignmentGuide[];
  appliedCrop: CropArea;
  cardPosition: CropDisplayOrigin;
  displayedCrop: CropArea;
  draftCrop: CropArea;
  fixedCropRatio: boolean;
  imagePosition: CropDisplayOrigin;
  imageSize: DisplaySize | null;
  isCropping: boolean;
  isImageSelected: boolean;
  selectedCropRatio: CropRatioId;
  selectedCropRatioValue: number | null | undefined;
  stageSize: DisplaySize | null;
  applyCrop: () => void;
  beginCrop: () => void;
  cancelCrop: () => void;
  changeCrop: (crop: CropArea) => void;
  clearAlignmentGuides: () => void;
  deselectImage: () => void;
  finishImageDrag: (position: CropDisplayOrigin) => void;
  moveImage: (event: Konva.KonvaEventObject<DragEvent>) => void;
  selectCropRatio: (ratio: CropRatioId) => void;
  selectImage: () => void;
}
