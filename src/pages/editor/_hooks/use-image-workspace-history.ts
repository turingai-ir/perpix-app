import { useEditorHistory } from "@/features/editor";
import {
  normalizePosition,
  type CropArea,
  type CropDisplayOrigin,
} from "../_model/crop-area";

const ZERO_POSITION: CropDisplayOrigin = { x: 0, y: 0 };

interface ImageWorkspaceSnapshot {
  appliedCrop: CropArea;
  normalizedImagePosition: CropDisplayOrigin;
}

export function useImageWorkspaceHistory(
  image: HTMLImageElement,
  documentId?: string,
) {
  const history = useEditorHistory<ImageWorkspaceSnapshot>(
    {
      appliedCrop: {
        height: image.naturalHeight,
        width: image.naturalWidth,
        x: 0,
        y: 0,
      },
      normalizedImagePosition: ZERO_POSITION,
    },
    documentId,
  );

  const finishImageDrag = (
    position: CropDisplayOrigin,
    imageSize: { height: number; width: number },
    cardPosition: CropDisplayOrigin,
  ) => {
    history.commit({
      ...history.current,
      normalizedImagePosition: normalizePosition(
        position,
        imageSize,
        cardPosition,
      ),
    });
  };
  const applyCrop = (nextCrop: CropArea) => {
    history.commit({ ...history.current, appliedCrop: nextCrop });
  };
  return { ...history, applyCrop, finishImageDrag };
}
