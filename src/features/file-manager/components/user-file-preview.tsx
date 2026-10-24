import { useState } from "react";
import { Check, FileAudio, FileVideo, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type MediaKind = "image" | "video" | "audio";
interface Props {
  kind: MediaKind;
  name: string;
  url?: string;
  visible: boolean;
  pending: boolean;
  error: boolean;
  selected: boolean;
}
export function UserFilePreview({
  kind,
  name,
  url,
  visible,
  pending,
  error,
  selected,
}: Props) {
  const [failedUrl, setFailedUrl] = useState<string>();
  const failed = error || (!!url && url === failedUrl);
  const Icon = kind === "video" ? FileVideo : FileAudio;
  const showImage = kind === "image" && url && !failed;
  const showVideo = kind === "video" && url && !failed;
  return (
    <div className="bg-muted relative aspect-square w-full overflow-hidden">
      {showImage ? (
        <img
          loading="lazy"
          decoding="async"
          src={visible ? url : undefined}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(url)}
        />
      ) : null}
      {showVideo ? (
        <video
          src={visible ? url : undefined}
          className="h-full w-full object-cover"
          preload="metadata"
          muted
          onError={() => setFailedUrl(url)}
        />
      ) : null}
      {pending && !url ? (
        <Skeleton className="h-full w-full rounded-none" />
      ) : null}
      {failed || (!pending && !url) || kind === "audio" ? (
        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
          {kind === "image" ? (
            <ImageIcon className="h-8 w-8 opacity-60" />
          ) : (
            <Icon className="h-8 w-8 opacity-60" />
          )}
        </div>
      ) : null}
      {selected ? (
        <span className="bg-primary text-primary-foreground absolute end-2 top-2 flex h-6 w-6 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );
}
