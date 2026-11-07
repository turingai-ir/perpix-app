import { AudioLines, Film } from "lucide-react";

import type { FilePreviewUrls, UserFileItem } from "@/features/file-manager";
import { DASHBOARD_FILE_MEDIA_CLASS } from "./dashboard-styles";

interface DashboardFileVisualProps {
  file: UserFileItem;
  preview?: FilePreviewUrls;
}

export function DashboardFileVisual({
  file,
  preview,
}: DashboardFileVisualProps) {
  if (file.content_type.startsWith("image/") && preview?.preview_url) {
    return (
      <img
        src={preview.preview_url}
        alt=""
        loading="lazy"
        className={DASHBOARD_FILE_MEDIA_CLASS}
      />
    );
  }
  if (file.content_type.startsWith("video/") && preview?.preview_url) {
    return (
      <video
        src={preview.preview_url}
        muted
        playsInline
        preload="metadata"
        className={DASHBOARD_FILE_MEDIA_CLASS}
      />
    );
  }
  const MediaIcon = file.content_type.startsWith("video/") ? Film : AudioLines;
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-(--image-accent-soft) to-(--video-accent-soft)">
      <MediaIcon className="text-muted-foreground h-8 w-8" />
    </div>
  );
}
