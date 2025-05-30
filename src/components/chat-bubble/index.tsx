import { useBodyBackground } from '@/hook';
import { Paper, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import type { FC, PropsWithChildren } from 'react';

interface ChatBubbleProps {
  dir?: 'ltr' | 'rtl';
  withBackground?: boolean;
  withBorder?: boolean;
  className?: string;
}
const ChatBubble: FC<PropsWithChildren<ChatBubbleProps>> = ({
  children,
  dir,
  withBackground,
  withBorder,
  className = '',
}) => {
  const theme = useMantineTheme();
  const colorScheme = useMantineColorScheme();
  const bodyBackground = useBodyBackground();
  return (
    <Paper
      dir={dir}
      withBorder={withBorder}
      p="sm"
      radius="lg"
      style={{
        backgroundColor: withBackground
          ? colorScheme.colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[2]
          : bodyBackground,
      }}
      className={className}
    >
      {children}
    </Paper>
  );
};

export default ChatBubble;
