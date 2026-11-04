import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryFallback } from "./gallery-fallback";
import type { GalleryMediaType } from "../_utils/types";
import styles from "../gallery.module.css";

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
  const [ready, setReady] = useState(false);
  if (mediaType === "audio" || failed)
    return <GalleryFallback mediaType={mediaType} />;
  const className = `${styles.previewImage} ${compact ? styles.coverImage : styles.containImage}`;
  if (mediaType === "video") {
    return (
      <>
        <video
          src={previewUrl}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className={className}
          style={{ opacity: ready ? 1 : 0 }}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            // A small seek makes browsers decode an opening frame without playback.
            video.currentTime = Number.isFinite(video.duration)
              ? Math.min(0.1, video.duration / 2)
              : 0.1;
          }}
          onLoadedData={(event) => {
            if (!event.currentTarget.seeking) setReady(true);
          }}
          onSeeked={(event) => {
            if (event.currentTarget.readyState >= 2) setReady(true);
          }}
          onError={() => setFailed(true)}
        />
        {!ready && (
          <Skeleton className="absolute inset-0 size-full rounded-none motion-reduce:animate-none" />
        )}
      </>
    );
  }
  return (
    <img
      src={previewUrl}
      alt={fileName}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
