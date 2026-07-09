import { useCallback, useEffect, useRef, useState } from "react";

export function useEditorImageSource(editorImageUrl?: string) {
  const [localImageSource, setLocalImageSource] = useState<string | null>(null);
  const [remoteImageState, setRemoteImageState] = useState<{
    url: string;
    source: string;
  } | null>(null);
  const localObjectUrlRef = useRef<string | null>(null);
  const remoteImageLoading =
    !!editorImageUrl && remoteImageState?.url !== editorImageUrl;
  let imageSource = localImageSource;
  if (editorImageUrl) {
    imageSource =
      remoteImageState?.url === editorImageUrl ? remoteImageState.source : null;
  }

  const revokeLocalObjectUrl = useCallback(() => {
    if (!localObjectUrlRef.current) return;
    URL.revokeObjectURL(localObjectUrlRef.current);
    localObjectUrlRef.current = null;
  }, []);

  const setLocalImageFile = useCallback(
    (file: File) => {
      revokeLocalObjectUrl();
      const objectUrl = URL.createObjectURL(file);
      localObjectUrlRef.current = objectUrl;
      setLocalImageSource(objectUrl);
    },
    [revokeLocalObjectUrl],
  );

  const clearImageSource = useCallback(() => {
    revokeLocalObjectUrl();
    setLocalImageSource(null);
  }, [revokeLocalObjectUrl]);

  useEffect(() => {
    if (!editorImageUrl) return;

    let active = true;

    readPreviewImageSource(editorImageUrl).then((nextImageSource) => {
      if (active) {
        setRemoteImageState({
          url: editorImageUrl,
          source: nextImageSource,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [editorImageUrl]);

  useEffect(() => revokeLocalObjectUrl, [revokeLocalObjectUrl]);

  return {
    imageSource,
    remoteImageLoading,
    setLocalImageFile,
    clearImageSource,
  };
}

async function readPreviewImageSource(previewUrl: string) {
  try {
    const response = await fetch(previewUrl);
    const blob = await response.blob();
    return await readBlobAsDataUrl(blob);
  } catch {
    return previewUrl;
  }
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
