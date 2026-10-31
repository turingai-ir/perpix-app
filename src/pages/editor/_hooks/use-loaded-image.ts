import { useEffect, useState } from "react";

interface LoadedImageState {
  image: HTMLImageElement | null;
  isError: boolean;
  source: string;
}

export function useLoadedImage(source: string) {
  const [loadedImageState, setLoadedImageState] =
    useState<LoadedImageState | null>(null);

  useEffect(() => {
    const image = new window.Image();

    image.onload = () => {
      setLoadedImageState({ image, isError: false, source });
    };
    image.onerror = () => {
      setLoadedImageState({ image: null, isError: true, source });
    };
    image.src = source;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [source]);

  if (loadedImageState?.source !== source) {
    return { image: null, isError: false };
  }
  return loadedImageState;
}
