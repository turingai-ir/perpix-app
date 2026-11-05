export interface EditorOverlay {
  text: string;
  color: string;
  size: number;
  opacity: number;
  position: number;
}

type Overlays = {
  textOverlay?: EditorOverlay;
  watermarkOverlay?: EditorOverlay;
};

export function drawEditorOverlays(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  edits: Overlays,
) {
  for (const overlay of [edits.textOverlay, edits.watermarkOverlay]) {
    if (!overlay?.text.trim()) continue;
    const text = overlay.text.trim().slice(0, 120);
    const lines = text.split("\n").slice(0, 3);
    const fontSize = Math.max(
      1,
      Math.min(
        (canvas.width * overlay.size) / 100,
        canvas.height / (lines.length * 1.3 + 0.2),
      ),
    );
    const margin = Math.max(1, Math.min(canvas.width, canvas.height) * 0.04);
    const column = overlay.position % 3;
    const row = Math.floor(overlay.position / 3);
    const x =
      column === 0
        ? canvas.width - margin
        : column === 1
          ? canvas.width / 2
          : margin;
    const blockHeight = lines.length * fontSize * 1.3;
    const y =
      row === 0
        ? margin
        : row === 1
          ? (canvas.height - blockHeight) / 2
          : canvas.height - margin - blockHeight;

    context.save();
    context.beginPath();
    context.rect(
      margin / 2,
      margin / 2,
      canvas.width - margin,
      canvas.height - margin,
    );
    context.clip();
    context.globalAlpha = overlay.opacity / 100;
    context.font = `700 ${fontSize}px Vazirmatn, sans-serif`;
    context.textAlign =
      column === 0 ? "right" : column === 1 ? "center" : "left";
    context.textBaseline = "top";
    context.fillStyle = overlay.color;
    context.shadowColor = "#00000099";
    context.shadowBlur = Math.max(1, fontSize / 8);
    lines.forEach((line, index) =>
      context.fillText(
        line,
        x,
        y + index * fontSize * 1.3,
        canvas.width - margin * 2,
      ),
    );
    context.restore();
  }
}
