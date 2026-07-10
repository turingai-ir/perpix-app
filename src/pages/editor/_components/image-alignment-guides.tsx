import { Line } from "react-konva";
import type { AlignmentGuide } from "../_hooks/use-image-alignment-snap";

interface ImageAlignmentGuidesProps {
  guides: AlignmentGuide[];
  stageHeight: number;
  stageWidth: number;
}

export function ImageAlignmentGuides({
  guides,
  stageHeight,
  stageWidth,
}: ImageAlignmentGuidesProps) {
  return guides.map((guide) => {
    const points = getGuidePoints(guide, stageHeight, stageWidth);
    return (
      <Line
        key={`${guide.orientation}-${guide.position}`}
        points={points}
        stroke="#3b82f6"
        strokeWidth={2}
        listening={false}
      />
    );
  });
}

function getGuidePoints(
  guide: AlignmentGuide,
  stageHeight: number,
  stageWidth: number,
): number[] {
  if (guide.orientation === "vertical") {
    return [guide.position, 0, guide.position, stageHeight];
  }
  return [0, guide.position, stageWidth, guide.position];
}
