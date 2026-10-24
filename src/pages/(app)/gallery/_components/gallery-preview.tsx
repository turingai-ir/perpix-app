import { useState, type FC } from "react";
import { FileVideo } from "lucide-react";

import { GalleryFallback } from "./gallery-fallback";

import type { GalleryMediaType } from "../_utils/types";

export const GalleryPreview: FC<{
  fileName: string;
  mediaType: GalleryMediaType;
  previewUrl: string;
}> = ({ fileName, mediaType, previewUrl }) => {
  const [failedUrl, setFailedUrl] = useState<string>();
  if (!previewUrl || failedUrl === previewUrl)
    return <GalleryFallback mediaType={mediaType} />;
  if (mediaType === "image") {
    return (
      <img
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        src={previewUrl}
        alt={fileName}
        onError={() => setFailedUrl(previewUrl)}
      />
    );
  }

  if (mediaType === "video") {
    return (
      <>
        <video
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          src={previewUrl}
          preload="metadata"
          muted
          onError={() => setFailedUrl(previewUrl)}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
          <FileVideo className="h-8 w-8 drop-shadow" />
        </span>
      </>
    );
  }

  return <GalleryFallback mediaType={mediaType} />;
};
