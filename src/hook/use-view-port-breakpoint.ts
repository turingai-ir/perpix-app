import { useEffect, useState } from 'react';
export const BREAKPOINTS = {
  sm: '(min-width: 40rem)',
  md: '(min-width: 48rem)',
  lg: '(min-width: 64rem)',
  xl: '(min-width: 80rem)',
  '2xl': '(min-width: 96rem)',
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Returns an object of all breakpoint matches.
 * Can be used both inside and outside React.
 */
export function getViewportBreakpoints(): Record<BreakpointKey, boolean> {
  if (typeof window === 'undefined') {
    return Object.keys(BREAKPOINTS).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<BreakpointKey, boolean>,
    );
  }

  return Object.entries(BREAKPOINTS).reduce(
    (acc, [key, query]) => ({
      ...acc,
      [key]: window.matchMedia(query).matches,
    }),
    {} as Record<BreakpointKey, boolean>,
  );
}

export function useViewportBreakpoint() {
  const [breakpoints, setBreakpoints] = useState<Record<BreakpointKey, boolean>>(() =>
    getViewportBreakpoints(),
  );

  useEffect(() => {
    const mediaQueries = Object.entries(BREAKPOINTS).map(([key, query]) => {
      const mediaQuery = window.matchMedia(query);

      const handleChange = () => {
        setBreakpoints((prev) => ({ ...prev, [key]: mediaQuery.matches }));
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    });

    return () => mediaQueries.forEach((cleanup) => cleanup());
  }, []);

  return breakpoints;
}
