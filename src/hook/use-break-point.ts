import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const useBreakPoint = () => {
  const theme = useMantineTheme();
  const xs = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);
  const sm = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  const md = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const lg = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
  const xl = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

  return {
    xs,
    sm,
    md,
    lg,
    xl,
  };
};
