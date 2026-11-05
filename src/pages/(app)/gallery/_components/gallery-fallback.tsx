import type { FC } from "react";
import { FileAudio, FileVideo, Image as ImageIcon } from "lucide-react";

import type { GalleryMediaType } from "../_utils/types";

export const GalleryFallback: FC<{ mediaType: GalleryMediaType }> = ({
  mediaType,
}) => {
  const Icon = { video: FileVideo, audio: FileAudio, image: ImageIcon }[
    mediaType
  ];

  return (
    <div
      aria-hidden="true"
      className="text-muted-foreground from-primary/10 flex h-full w-full items-center justify-center bg-radial to-transparent"
    >
      <span className="bg-background/70 border-border/60 grid size-16 place-items-center rounded-2xl border">
        <Icon className="size-7" />
      </span>
    </div>
  );
};
