import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteTriggerOptions {
  offset?: number;
  disabled?: boolean;
  loading?: boolean;
  onTrigger: () => void;
}

export function useInfiniteScroll<T extends HTMLElement>({
  offset = 0,
  disabled = false,
  loading = false,
  onTrigger,
}: UseInfiniteTriggerOptions): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      isVisibleRef.current = entry.isIntersecting;

      if (entry.isIntersecting && !disabled && !loading) {
        onTrigger();
      }
    },
    [disabled, loading, onTrigger],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) {
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: `0px 0px ${offset}px 0px`,
      threshold: 0.1,
    });

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [offset, handleIntersect, disabled]);

  useEffect(() => {
    if (!loading && isVisibleRef.current && !disabled) {
      onTrigger();
    }
  }, [loading, disabled, onTrigger]);

  return ref;
}
