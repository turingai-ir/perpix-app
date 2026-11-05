import { drawEditorOverlays, type EditorOverlay } from "./editor-overlays";

export interface EditorEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  textOverlay?: EditorOverlay;
  watermarkOverlay?: EditorOverlay;
}

export const DEFAULT_EDITOR_EDITS: EditorEdits = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  flipX: false,
  flipY: false,
  textOverlay: {
    text: "",
    color: "#ffffff",
    size: 8,
    opacity: 100,
    position: 4,
  },
  watermarkOverlay: {
    text: "",
    color: "#ffffff",
    size: 4,
    opacity: 65,
    position: 8,
  },
};

export function renderEditedImage(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  edits: EditorEdits,
  maxEdge = Number.POSITIVE_INFINITY,
  outputWidth?: number,
): HTMLCanvasElement {
  const quarterTurn = edits.rotation === 90 || edits.rotation === 270;
  const naturalWidth = quarterTurn ? crop.height : crop.width;
  const naturalHeight = quarterTurn ? crop.width : crop.height;
  const requestedWidth = outputWidth ?? naturalWidth;
  const requestedHeight = (requestedWidth * naturalHeight) / naturalWidth;
  const scale = Math.min(
    1,
    maxEdge / Math.max(requestedWidth, requestedHeight),
  );
  const canvasWidth = Math.max(1, Math.round(requestedWidth * scale));
  const canvasHeight = Math.max(1, Math.round(requestedHeight * scale));
  const sourceWidth = quarterTurn ? canvasHeight : canvasWidth;
  const sourceHeight = quarterTurn ? canvasWidth : canvasHeight;
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2D context");

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((edits.rotation * Math.PI) / 180);
  context.scale(edits.flipX ? -1 : 1, edits.flipY ? -1 : 1);
  context.filter = `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturation}%)`;
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -sourceWidth / 2,
    -sourceHeight / 2,
    sourceWidth,
    sourceHeight,
  );
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.filter = "none";
  drawEditorOverlays(context, canvas, edits);
  return canvas;
}
