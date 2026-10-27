import { useEditorHistory } from "@/features/editor";
import { DEFAULT_EDITOR_EDITS, type EditorEdits } from "../_model/editor-edits";
import {
  normalizePosition,
  type CropArea,
  type CropDisplayOrigin,
} from "../_model/crop-area";

const ZERO_POSITION: CropDisplayOrigin = { x: 0, y: 0 };

interface ImageWorkspaceSnapshot {
  appliedCrop: CropArea;
  normalizedImagePosition: CropDisplayOrigin;
  edits: EditorEdits;
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
      edits: DEFAULT_EDITOR_EDITS,
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
  const updateEdits = (edits: EditorEdits) => {
    history.commit({ ...history.current, edits });
  };
  return { ...history, applyCrop, finishImageDrag, updateEdits };
}
