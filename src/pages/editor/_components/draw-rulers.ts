import type { Context } from "konva/lib/Context";

export function drawRulers(
  context: Context,
  stageSize: { width: number; height: number },
  cardPosition: { x: number; y: number },
  rulerSize: number,
): void {
  const width = stageSize.width;
  const height = stageSize.height;

  // Clear area & fill ruler backgrounds
  context.fillStyle = "rgba(24, 24, 27, 0.95)";
  context.fillRect(0, 0, width, rulerSize);
  context.fillRect(0, 0, rulerSize, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.2)";
  context.lineWidth = 1;
  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.font = "9px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Top Ruler (Horizontal)
  const startXIdx = Math.ceil((rulerSize - cardPosition.x) / 10);
  for (let i = startXIdx; ; i++) {
    const x = cardPosition.x + i * 10;
    if (x > width) break;

    const val = i * 10;
    if (i % 10 === 0) {
      context.beginPath();
      context.moveTo(x, 10);
      context.lineTo(x, rulerSize);
      context.stroke();
      context.fillText(val.toString(), x, 5);
    } else if (i % 5 === 0) {
      context.beginPath();
      context.moveTo(x, 14);
      context.lineTo(x, rulerSize);
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(x, 17);
      context.lineTo(x, rulerSize);
      context.stroke();
    }
  }

  // Left Ruler (Vertical)
  const startYIdx = Math.ceil((rulerSize - cardPosition.y) / 10);
  for (let i = startYIdx; ; i++) {
    const y = cardPosition.y + i * 10;
    if (y > height) break;

    const val = i * 10;
    if (i % 10 === 0) {
      context.beginPath();
      context.moveTo(10, y);
      context.lineTo(rulerSize, y);
      context.stroke();

      context.save();
      context.translate(5, y);
      context.rotate(-Math.PI / 2);
      context.fillText(val.toString(), 0, 0);
      context.restore();
    } else if (i % 5 === 0) {
      context.beginPath();
      context.moveTo(14, y);
      context.lineTo(rulerSize, y);
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(17, y);
      context.lineTo(rulerSize, y);
      context.stroke();
    }
  }

  // Border lines
  context.strokeStyle = "rgba(255, 255, 255, 0.1)";
  context.beginPath();
  context.moveTo(rulerSize, 0);
  context.lineTo(rulerSize, height);
  context.moveTo(0, rulerSize);
  context.lineTo(width, rulerSize);
  context.stroke();

  // Corner intersection box
  context.fillStyle = "rgba(15, 15, 15, 0.98)";
  context.fillRect(0, 0, rulerSize, rulerSize);
}
