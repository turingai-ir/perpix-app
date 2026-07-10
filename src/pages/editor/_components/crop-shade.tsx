import { Rect } from "react-konva";
import type { CropArea } from "../_model/crop-area";

interface CropShadeProps {
  bounds: CropArea;
  crop: CropArea;
}

export function CropShade({ bounds, crop }: CropShadeProps) {
  const shade = { fill: "rgba(0, 0, 0, 0.55)", listening: false } as const;
  return (
    <>
      <Rect
        {...shade}
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={crop.y - bounds.y}
      />
      <Rect
        {...shade}
        x={bounds.x}
        y={crop.y + crop.height}
        width={bounds.width}
        height={bounds.y + bounds.height - crop.y - crop.height}
      />
      <Rect
        {...shade}
        x={bounds.x}
        y={crop.y}
        width={crop.x - bounds.x}
        height={crop.height}
      />
      <Rect
        {...shade}
        x={crop.x + crop.width}
        y={crop.y}
        width={bounds.x + bounds.width - crop.x - crop.width}
        height={crop.height}
      />
    </>
  );
}
