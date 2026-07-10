const SNAP_DISTANCE = 8;
const SNAP_MATCH_TOLERANCE = 0.01;

interface ImageAlignmentSnap {
  delta: number;
  position: number;
}

export function getImageAlignmentSnaps(
  imagePosition: number,
  imageSize: number,
  stageSize: number,
): ImageAlignmentSnap[] {
  const stageGuides = [0, stageSize / 2, stageSize];
  const imageGuides = [
    imagePosition,
    imagePosition + imageSize / 2,
    imagePosition + imageSize,
  ];
  const availableSnaps: ImageAlignmentSnap[] = [];

  for (const stageGuide of stageGuides) {
    for (const imageGuide of imageGuides) {
      const delta = stageGuide - imageGuide;
      if (Math.abs(delta) > SNAP_DISTANCE) continue;
      availableSnaps.push({ delta, position: stageGuide });
    }
  }

  const closestDistance = Math.min(
    ...availableSnaps.map((snap) => Math.abs(snap.delta)),
  );
  if (!Number.isFinite(closestDistance)) return [];
  return availableSnaps.filter(
    (snap) =>
      Math.abs(Math.abs(snap.delta) - closestDistance) < SNAP_MATCH_TOLERANCE,
  );
}
