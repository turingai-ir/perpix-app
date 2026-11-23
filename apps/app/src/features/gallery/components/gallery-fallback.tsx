import type { FC } from "react";
import { FileAudio, FileVideo, Image as ImageIcon } from "lucide-react";

import type { GalleryMediaType } from "../model/types";

export const GalleryFallback: FC<{ mediaType: GalleryMediaType }> = ({
  mediaType,
}) => {
  const Icon = { video: FileVideo, audio: FileAudio, image: ImageIcon }[
    mediaType
  ];

  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-radial from-primary/10 to-transparent text-muted-foreground"
    >
      <span className="grid size-16 place-items-center rounded-2xl border border-border/60 bg-background/70">
        <Icon className="size-7" />
      </span>
    </div>
  );
};
