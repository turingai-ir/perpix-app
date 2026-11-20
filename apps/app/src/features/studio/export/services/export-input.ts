import { BlobSource, Input, MP4, QTFF, UrlSource, WEBM } from "mediabunny";

const SOURCE_CACHE_BYTES = 8 * 1024 * 1024;

const rangeFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const size = Number(response.headers.get("Content-Length"));
  if (response.status === 200 && (size <= 0 || size > SOURCE_CACHE_BYTES)) {
    await response.body?.cancel();
    throw new Error("The video server does not support range reads");
  }
  return response;
};

export function openExportInput(source: string | Blob) {
  return new Input({
    source:
      typeof source === "string"
        ? new UrlSource(source, {
            fetchFn: rangeFetch,
            maxCacheSize: SOURCE_CACHE_BYTES,
            parallelism: 1,
            getRetryDelay: (attempts) => (attempts < 2 ? 0.5 : null),
          })
        : new BlobSource(source, { maxCacheSize: SOURCE_CACHE_BYTES }),
    formats: [MP4, QTFF, WEBM],
  });
}

export async function canDecodeSources(sources: readonly (string | Blob)[]) {
  for (const source of new Set(sources)) {
    const input = openExportInput(source);
    try {
      const [video, audio] = await Promise.all([
        input.getPrimaryVideoTrack(),
        input.getPrimaryAudioTrack(),
      ]);
      if (
        !video ||
        !(await video.canDecode()) ||
        (audio && !(await audio.canDecode()))
      )
        return false;
    } catch {
      return false;
    } finally {
      input.dispose();
    }
  }
  return true;
}
