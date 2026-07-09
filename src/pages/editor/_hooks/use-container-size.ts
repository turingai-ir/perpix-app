import { useState, useEffect, type RefObject } from "react";

export function useContainerSize(ref: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
