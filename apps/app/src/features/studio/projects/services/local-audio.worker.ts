import {
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  QTFF,
  WEBM,
  MP4,
  Mp3OutputFormat,
  Output,
} from "mediabunny";
import { registerMp3Encoder } from "@mediabunny/mp3-encoder";
import type { LocalAudioResult } from "./local-audio";
import { fingerprintVideo } from "./local-video";

const MAX_SECONDS = 30 * 60;

async function prepare(file: File): Promise<LocalAudioResult> {
  const input = new Input({
    source: new BlobSource(file),
    formats: [MP4, QTFF, WEBM],
  });
  try {
    const [track] = await input.getAudioTracks();
    if (!track) return { ok: false, reason: "noAudio" };
    const start = Math.max(0, await track.getFirstTimestamp());
    const end = await track.computeDuration();
    if (end - start >= MAX_SECONDS) return { ok: false, reason: "tooLong" };
    registerMp3Encoder();
    const target = new BufferTarget();
    const conversion = await Conversion.init({
      input,
      output: new Output({ format: new Mp3OutputFormat(), target }),
      video: { discard: true },
      audio: (candidate) =>
        candidate.id === track.id
          ? {
              codec: "mp3",
              numberOfChannels: 1,
              sampleRate: 16_000,
              bitrate: 32_000,
              forceTranscode: true,
            }
          : { discard: true },
      trim: { start },
    });
    if (!conversion.isValid) return { ok: false, reason: "encoding" };
    await conversion.execute();
    if (!target.buffer?.byteLength) return { ok: false, reason: "encoding" };
    return {
      ok: true,
      audio: target.buffer,
      fingerprint: await fingerprintVideo(file),
      audioStartMs: Math.round(start * 1000),
    };
  } finally {
    input.dispose();
  }
}

self.onmessage = (event: MessageEvent<File>) => {
  void prepare(event.data).then(
    (result) =>
      self.postMessage(
        result,
        result.ok ? { transfer: [result.audio] } : undefined,
      ),
    () =>
      self.postMessage({
        ok: false,
        reason: "encoding",
      } satisfies LocalAudioResult),
  );
};
