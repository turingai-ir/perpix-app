import { useCallback, useEffect, useState } from "react";
import { useFilePreview } from "./use-previews";

export function useVisibleFilePreview(id: string) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: HTMLElement | null) => setElement(node), []);
  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return { ref, visible, ...useFilePreview(id, visible) };
}
