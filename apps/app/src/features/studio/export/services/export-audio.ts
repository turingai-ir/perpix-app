import { AudioSample, AudioSampleSink, type InputAudioTrack } from "mediabunny";
import { AUDIO_RATE, type ExportSegment } from "../model/video-export";

function* silence(from: number, until: number) {
  for (let at = from; at < until;) {
    const count = Math.min(4096, until - at);
    yield new AudioSample({
      format: "f32-planar",
      data: new Float32Array(count * 2),
      numberOfChannels: 2,
      sampleRate: AUDIO_RATE,
      timestamp: at / AUDIO_RATE,
    });
    at += count;
  }
}

/** Cuts the decoded PCM on the timeline's sample clock and pads any gaps. */
export async function* exportAudio(
  track: InputAudioTrack | null,
  segment: ExportSegment,
) {
  const start = Math.round((segment.startMs * AUDIO_RATE) / 1000);
  const end = Math.round((segment.endMs * AUDIO_RATE) / 1000);
  const sourceStart = segment.sourceInMs / 1000;
  const sourceEnd = sourceStart + (end - start) / AUDIO_RATE;
  let cursor = start;
  if (track) {
    const sink = new AudioSampleSink(track);
    for await (const sample of sink.samples(
      Math.max(0, sourceStart - 0.1),
      sourceEnd,
    )) {
      try {
        const offset = (sample.timestamp - sourceStart) * AUDIO_RATE;
        const from = Math.max(cursor, start + Math.round(offset));
        const to = Math.min(
          end,
          start + Math.round(offset + sample.duration * AUDIO_RATE),
        );
        if (to <= from) continue;
        yield* silence(cursor, from);
        const frames = to - from;
        const data = new Float32Array(frames * 2);
        for (let channel = 0; channel < 2; channel++) {
          const plane = new Float32Array(sample.numberOfFrames);
          sample.copyTo(plane, {
            format: "f32-planar",
            planeIndex: Math.min(channel, sample.numberOfChannels - 1),
          });
          for (let index = 0; index < frames; index++) {
            const position = Math.max(
              0,
              ((from - start - offset + index) * sample.sampleRate) /
                AUDIO_RATE,
            );
            const left = Math.min(plane.length - 1, Math.floor(position));
            const right = Math.min(plane.length - 1, left + 1);
            data[channel * frames + index] =
              plane[left] +
              (plane[right] - plane[left]) * (position - Math.floor(position));
          }
        }
        cursor = to;
        yield new AudioSample({
          format: "f32-planar",
          data,
          numberOfChannels: 2,
          sampleRate: AUDIO_RATE,
          timestamp: from / AUDIO_RATE,
        });
      } finally {
        sample.close();
      }
    }
  }
  yield* silence(cursor, end);
}
