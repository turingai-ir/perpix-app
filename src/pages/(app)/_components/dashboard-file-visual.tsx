import { AudioLines, Film } from "lucide-react";

import type { FilePreviewUrls, UserFileItem } from "@/feature/file-manager";
import styles from "../dashboard.module.css";

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
        className={styles.fileMedia}
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
        className={styles.fileMedia}
      />
    );
  }
  const MediaIcon = file.content_type.startsWith("video/") ? Film : AudioLines;
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10">
      <MediaIcon className="h-8 w-8 text-zinc-500" />
    </div>
  );
}
