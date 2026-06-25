import type { FC, ReactNode } from "react";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Muted } from "../ui/typography";

import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { cn } from "@/lib/utils";
import { MediaPreviewItem } from "@/components/custom/media-preview-item";

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
                  <MediaPreviewItem fileId={image} index={index} type="image" />
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
                  <MediaPreviewItem fileId={video} index={index} type="video" />
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

ChatBubble.displayName = "ChatBubble";
