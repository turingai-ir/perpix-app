import { useState } from "react";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import type { GalleryMediaType } from "../_utils/types";

interface Props {
  url?: string;
  name: string;
  mediaType: GalleryMediaType;
  zoomed: boolean;
}
export function GalleryViewerMedia({ url, name, mediaType, zoomed }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (!url || failed)
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-4">
        <ImageOff className="size-10" />
        <p>{t("pages.gallery.studio.previewError")}</p>
        {url && (
          <Button
            variant="outline"
            className="h-11"
            onClick={() => {
              setFailed(false);
              setAttempt(attempt + 1);
            }}
          >
            {t("pages.gallery.studio.retryPreview")}
          </Button>
        )}
      </div>
    );
  if (mediaType === "image")
    return (
      <div dir="ltr" className="size-full overflow-auto">
        <img
          key={attempt}
          src={url}
          alt={name}
          onError={() => setFailed(true)}
          className={
            zoomed ? "block w-[200%] max-w-none" : "size-full object-contain"
          }
        />
      </div>
    );
  // User uploads do not currently include caption tracks.

  if (mediaType === "video")
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption -- User uploads have no caption tracks.
      <video
        key={attempt}
        src={url}
        controls
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="max-h-full max-w-full"
      />
    );

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption -- User uploads have no caption tracks.
    <audio
      key={attempt}
      src={url}
      controls
      preload="metadata"
      onError={() => setFailed(true)}
      className="w-full max-w-xl"
    />
  );
}
