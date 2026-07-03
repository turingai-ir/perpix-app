import type { FC } from "react";
import { FileAudio, FileVideo, Image as ImageIcon } from "lucide-react";

import type { GalleryMediaType } from "../_utils/types";

export const GalleryFallback: FC<{ mediaType: GalleryMediaType }> = ({
  mediaType,
}) => {
  const Icon =
    mediaType === "video"
      ? FileVideo
      : mediaType === "audio"
        ? FileAudio
        : ImageIcon;

  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center">
      <Icon className="h-9 w-9 opacity-60" />
    </div>
  );
};
