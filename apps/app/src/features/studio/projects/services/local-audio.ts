export type LocalAudioResult =
  | { ok: true; audio: ArrayBuffer; fingerprint: string; audioStartMs: number }
  | { ok: false; reason: "noAudio" | "tooLong" | "encoding" };

export function extractLocalAudio(file: File): Promise<LocalAudioResult> {
  const worker = new Worker(
    new URL("./local-audio.worker.ts", import.meta.url),
    { type: "module" },
  );
  return new Promise((resolve) => {
    const finish = (result: LocalAudioResult) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };
    const timer = window.setTimeout(
      () => finish({ ok: false, reason: "encoding" }),
      180_000,
    );
    worker.onmessage = (event: MessageEvent<LocalAudioResult>) =>
      finish(event.data);
    worker.onerror = () => finish({ ok: false, reason: "encoding" });
    worker.postMessage(file);
  });
}
