import type { FC, ReactNode } from 'react';
import dayjs from 'dayjs';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Muted } from '../ui/typography';

import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';

type Sender = 'agent' | 'user';
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
      className="w-full flex gap-2"
      style={{
        flexDirection: sender === 'agent' ? 'row' : 'row-reverse',
      }}
    >
      <div className="flex-col flex gap-2 w-full">
        {timestamp ? (
          <div>
            <Muted>{dayjs(timestamp).format('HH:mm')}</Muted>
          </div>
        ) : null}
        {status === 'FAILED' ? (
          <div>
            <Muted>{t('common.taskStatus.failed')}</Muted>
          </div>
        ) : null}
        {message ? <div className="bg-accent rounded-md p-3">{message}</div> : null}
        {images?.length ? (
          <div
            className={
              images.length > 1 ? 'grid grid-cols-2 gap-2 w-full' : 'flex flex-col w-full gap-1'
            }
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full">
                {typeof image === 'string' ? (
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src={image}
                    alt={`img-${index}`}
                  />
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
              videos.length > 1 ? 'grid grid-cols-2 gap-2 w-full' : 'flex flex-col w-full gap-1'
            }
          >
            {videos.map((video, index) => (
              <div key={index} className="w-full h-full">
                {typeof video === 'string' ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video className="w-full h-auto object-cover rounded-lg" src={video} controls />
                ) : (
                  video
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="min-w-fit">
        {typeof avatar === 'string' ? (
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

ChatBubble.displayName = 'ChatBubble';
