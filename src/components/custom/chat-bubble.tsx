import type { FC, ReactNode } from 'react';
import dayjs from 'dayjs';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Muted } from '../ui/typography';

type Sender = 'agent' | 'user';
interface ChatBubbleProps {
  avatar: string | ReactNode;
  message?: string | ReactNode;
  timestamp?: Date;
  sender: Sender;
  images?: (string | ReactNode)[];
}
export const ChatBubble: FC<ChatBubbleProps> = ({ avatar, message, sender, timestamp, images }) => {
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
        {message ? <div className="bg-accent rounded-md p-3">{message}</div> : null}
        {images ? (
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
