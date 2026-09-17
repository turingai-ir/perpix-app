import { useEffect, useRef, useState } from "react";

export function useNeuralCanvasSize() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const bounds = container.getBoundingClientRect();
      setSize({
        width: Math.ceil(bounds.width),
        height: Math.ceil(bounds.height),
      });
    };
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    updateSize();
    return () => observer.disconnect();
  }, []);

  return { containerRef, ...size };
}
