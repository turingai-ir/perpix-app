import { useMantineColorScheme, useMantineTheme } from '@mantine/core';

export const useBodyBackground = () => {
  const theme = useMantineTheme();
  const colorScheme = useMantineColorScheme();
  return colorScheme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1];
};
