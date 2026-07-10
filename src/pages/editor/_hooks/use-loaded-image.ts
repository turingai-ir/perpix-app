import { useEffect, useState } from "react";

interface LoadedImageState {
  image: HTMLImageElement | null;
  source: string;
}

export function useLoadedImage(source: string): HTMLImageElement | null {
  const [loadedImageState, setLoadedImageState] =
    useState<LoadedImageState | null>(null);

  useEffect(() => {
    const image = new window.Image();

    image.onload = () => {
      setLoadedImageState({ image, source });
    };
    image.src = source;

    return () => {
      image.onload = null;
    };
  }, [source]);

  if (loadedImageState?.source !== source) return null;
  return loadedImageState.image;
}
