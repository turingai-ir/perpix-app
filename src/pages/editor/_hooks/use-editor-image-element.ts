import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";

import { loadImage } from "../_services/image-processor";
import { loadingAtom } from "./store";

export function useEditorImageElement(srcImage: string | null) {
  const setLoading = useSetAtom(loadingAtom);
  const [loadedImage, setLoadedImage] = useState<{
    element: HTMLImageElement;
    source: string;
  } | null>(null);

  useEffect(() => {
    if (!srcImage) {
      return;
    }

    let isCurrentImageRequest = true;

    setLoading(true);
    loadImage(srcImage)
      .then((loadedImageElement) => {
        if (isCurrentImageRequest) {
          setLoadedImage({ element: loadedImageElement, source: srcImage });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      isCurrentImageRequest = false;
    };
  }, [srcImage, setLoading]);

  if (loadedImage?.source !== srcImage) {
    return null;
  }

  return loadedImage.element;
}
