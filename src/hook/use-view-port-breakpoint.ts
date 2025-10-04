import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  sm: '(min-width: 40rem)',
  md: '(min-width: 48rem)',
  lg: '(min-width: 64rem)',
  xl: '(min-width: 80rem)',
  '2xl': '(min-width: 96rem)',
} as const;

type BREAKPOINTS_KEYS = keyof typeof BREAKPOINTS;

export function useViewportBreakpoint() {
  const [breakpoints, setBreakpoints] = useState<Record<BREAKPOINTS_KEYS, boolean>>(() =>
    Object.keys(BREAKPOINTS).reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          typeof window !== 'undefined'
            ? window.matchMedia(BREAKPOINTS[key as keyof typeof BREAKPOINTS]).matches
            : false,
      }),
      {} as Record<BREAKPOINTS_KEYS, boolean>,
    ),
  );

  useEffect(() => {
    const mediaQueries = Object.entries(BREAKPOINTS).map(([key, query]) => {
      const mediaQuery = window.matchMedia(query);

      // Set initial value immediately
      setBreakpoints((prev) => ({ ...prev, [key]: mediaQuery.matches }));

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
