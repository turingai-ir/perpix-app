import type { Context } from "konva/lib/Context";

export function drawRulers(
  context: Context,
  stageSize: { width: number; height: number },
  cardPosition: { x: number; y: number },
  rulerSize: number,
  zoom: number,
  pan: { x: number; y: number },
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

  // Determine dynamic tick spacing based on zoom level to prevent crowding
  let tickSpacing = 10;
  let labelInterval = 10; // label every 10 ticks
  if (zoom < 0.25) {
    tickSpacing = 100;
    labelInterval = 10; // label every 1000px
  } else if (zoom < 0.6) {
    tickSpacing = 50;
    labelInterval = 10; // label every 500px
  } else if (zoom > 3.0) {
    tickSpacing = 5;
    labelInterval = 10; // label every 50px
  }

  const spacingOnScreen = tickSpacing * zoom;

  // Top Ruler (Horizontal)
  const originScreenX = pan.x + cardPosition.x * zoom;
  const startXIdx = Math.ceil((rulerSize - originScreenX) / spacingOnScreen);
  for (let i = startXIdx; ; i++) {
    const x = originScreenX + i * spacingOnScreen;
    if (x > width) break;

    const val = i * tickSpacing;
    if (i % labelInterval === 0) {
      context.beginPath();
      context.moveTo(x, 10);
      context.lineTo(x, rulerSize);
      context.stroke();
      context.fillText(val.toString(), x, 5);
    } else if (i % (labelInterval / 2) === 0) {
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
  const originScreenY = pan.y + cardPosition.y * zoom;
  const startYIdx = Math.ceil((rulerSize - originScreenY) / spacingOnScreen);
  for (let i = startYIdx; ; i++) {
    const y = originScreenY + i * spacingOnScreen;
    if (y > height) break;

    const val = i * tickSpacing;
    if (i % labelInterval === 0) {
      context.beginPath();
      context.moveTo(10, y);
      context.lineTo(rulerSize, y);
      context.stroke();

      context.save();
      context.translate(5, y);
      context.rotate(-Math.PI / 2);
      context.fillText(val.toString(), 0, 0);
      context.restore();
    } else if (i % (labelInterval / 2) === 0) {
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
