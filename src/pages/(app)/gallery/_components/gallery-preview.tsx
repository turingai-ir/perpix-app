import { useState } from "react";
import { GalleryFallback } from "./gallery-fallback";
import type { GalleryMediaType } from "../_utils/types";

interface Props {
  mediaType: GalleryMediaType;
  previewUrl: string;
  fileName: string;
  compact: boolean;
  eager: boolean;
}
export function GalleryPreview({
  mediaType,
  previewUrl,
  fileName,
  compact,
  eager,
}: Props) {
  const [failed, setFailed] = useState(false);
  if (mediaType !== "image" || failed)
    return <GalleryFallback mediaType={mediaType} />;
  return (
    <img
      src={previewUrl}
      alt={fileName}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`size-full ${compact ? "object-cover" : "object-contain p-2"}`}
    />
  );
}
