import type { FC, ReactNode } from "react";
import dayjs from "dayjs";
import { AlertCircle, Image as ImageIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Muted } from "../ui/typography";

import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { useFilePreview } from "@/feature/file-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Sender = "agent" | "user";
interface ChatBubbleProps {
  avatar: string | ReactNode;
  message?: string | ReactNode;
  timestamp?: Date;
  sender: Sender;
  images?: (string | ReactNode)[];
  videos?: (string | ReactNode)[];
  status?: any;
}

interface ChatBubbleImagePreviewItemProps {
  imageId: string;
  index: number;
}

interface ChatBubbleVideoPreviewItemProps {
  videoId: string;
}

export const ChatBubble: FC<ChatBubbleProps> = ({
  avatar,
  message,
  sender,
  timestamp,
  images,
  status,
  videos,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div
      className={cn("flex w-full", { "gap-2": !!avatar })}
      style={{
        flexDirection: sender === "agent" ? "row" : "row-reverse",
      }}
    >
      <div className="flex w-full flex-col gap-2">
        {timestamp ? (
          <div>
            <Muted>{dayjs(timestamp).format("HH:mm")}</Muted>
          </div>
        ) : null}
        {status === "FAILED" ? (
          <div>
            <Muted>{t("common.taskStatus.failed")}</Muted>
          </div>
        ) : null}
        {message ? (
          <div className="bg-accent rounded-md p-3">{message}</div>
        ) : null}
        {images?.length ? (
          <div
            className={
              images.length > 1
                ? "grid w-full grid-cols-2 gap-2"
                : "flex w-full flex-col gap-1"
            }
          >
            {images.map((image, index) => (
              <div key={index} className="h-full w-full">
                {typeof image === "string" ? (
                  <ChatBubbleImagePreviewItem imageId={image} index={index} />
                ) : (
                  image
                )}
              </div>
            ))}
          </div>
        ) : null}
        {videos?.length ? (
          <div
            className={
              videos.length > 1
                ? "grid w-full grid-cols-2 gap-2"
                : "flex w-full flex-col gap-1"
            }
          >
            {videos.map((video, index) => (
              <div key={index} className="h-full w-full">
                {typeof video === "string" ? (
                  <ChatBubbleVideoPreviewItem videoId={video} />
                ) : (
                  video
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="min-w-fit">
        {typeof avatar === "string" ? (
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
        ) : (
          avatar
        )}
      </div>
    </div>
  );
};

const ChatBubbleVideoPreviewItem: FC<ChatBubbleVideoPreviewItemProps> = ({
  videoId,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(videoId);

  const isPreviewLoading = getFilePreviewState.isPending;
  const isError = getFilePreviewState.isError;
  const videoUrl = getFilePreviewState.data?.presigned_url;

  return (
    <div
      className={cn(
        "bg-background flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {!isError && videoUrl ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className="h-full w-full object-cover" src={videoUrl} controls />
      ) : null}

      {isError && (
        <ErrorPreview label={t("common.error")} className="text-destructive" />
      )}

      {!isPreviewLoading && !isError && !videoUrl && <EmptyImagePreview />}

      {isPreviewLoading && !videoUrl && (
        <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
      )}
    </div>
  );
};

const ChatBubbleImagePreviewItem: FC<ChatBubbleImagePreviewItemProps> = ({
  imageId,
  index,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(imageId);

  const isPreviewLoading = getFilePreviewState.isPending;
  const isError = getFilePreviewState.isError;
  const imageUrl = getFilePreviewState.data?.presigned_url;

  return (
    <div
      className={cn(
        "bg-background flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {!isError && imageUrl ? (
        <img
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={`img-${index}`}
        />
      ) : null}

      {isError && (
        <ErrorPreview label={t("common.error")} className="text-destructive" />
      )}

      {!isPreviewLoading && !isError && !imageUrl && <EmptyImagePreview />}

      {isPreviewLoading && !imageUrl && (
        <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
      )}
    </div>
  );
};

const EmptyImagePreview = () => (
  <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-1">
    <ImageIcon className="h-6 w-6 opacity-40" />
  </div>
);

const ErrorPreview: FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  <div
    className={cn(
      "flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center",
      className,
    )}
  >
    <AlertCircle className="h-5 w-5" />
    <span className="text-[10px] whitespace-normal">{label}</span>
  </div>
);

ChatBubble.displayName = "ChatBubble";
