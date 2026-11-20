import { offscreenCaptions } from "@perpix/caption-renderer/offscreen";
import {
  AudioSampleSource,
  CanvasSink,
  CanvasSource,
  Mp4OutputFormat,
  Output,
  StreamTarget,
  WebMOutputFormat,
} from "mediabunny";
import {
  AUDIO_BITRATE,
  EXPORT_LATENCY_MODE,
  type ExportRequest,
  type ExportSegment,
} from "../model/video-export";
import { exportAudio } from "./export-audio";
import { openExportInput } from "./export-input";
import { exportDirectory } from "./export-storage";

type RenderRequest = Extract<ExportRequest, { type: "render" }>;

const fontFiles = [
  "Thin",
  "ExtraLight",
  "Light",
  "Regular",
  "Medium",
  "SemiBold",
  "Bold",
  "ExtraBold",
  "Black",
];
async function loadFont(project: RenderRequest["project"]) {
  const { family, weight } = project.template.base.font;
  if (family.toLowerCase() !== "vazirmatn") return;
  const variant =
    fontFiles[Math.min(8, Math.max(0, Math.round(weight / 100) - 1))];
  const face = await new FontFace(
    family,
    `url(/fonts/vazirmatn/Vazirmatn-${variant}.woff2)`,
    {
      weight: String(weight),
    },
  ).load();
  (self as unknown as { fonts: FontFaceSet }).fonts.add(face);
}

function* sourceTimestamps(
  segment: ExportSegment,
  from: number,
  to: number,
  fps: number,
) {
  for (let frame = from; frame < to; frame++) {
    yield segment.sourceInMs / 1000 + frame / fps - segment.startMs / 1000;
  }
}

export async function renderVideo(
  request: RenderRequest,
  report: (progress: number) => void,
): Promise<File> {
  const {
    id,
    project,
    profile: { width, height, fps, bitrate, avc },
    format,
    hardwareAcceleration,
  } = request;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas is unavailable");
  await loadFont(project);
  const captions = offscreenCaptions(
    project.template,
    project.words,
    width,
    height,
  );
  const file = await (
    await exportDirectory()
  ).getFileHandle(id, { create: true });
  const writer = await file.createWritable();
  const mp4 = format === "mp4";
  const output = new Output({
    format: mp4
      ? new Mp4OutputFormat({ fastStart: false })
      : new WebMOutputFormat(),
    target: new StreamTarget(
      new WritableStream({
        write: (chunk) =>
          writer.write({
            type: "write",
            position: chunk.position,
            data: chunk.data,
          }),
        close: () => writer.close(),
        abort: () => writer.abort(),
      }),
      { chunked: true, chunkSize: 1024 * 1024 },
    ),
  });
  const video = new CanvasSource(canvas, {
    codec: mp4 ? "avc" : "vp8",
    fullCodecString: mp4 ? avc : undefined,
    bitrate,
    latencyMode: EXPORT_LATENCY_MODE,
    hardwareAcceleration,
    keyFrameInterval: 2,
  });
  const audio = new AudioSampleSource({
    codec: mp4 ? "aac" : "opus",
    bitrate: AUDIO_BITRATE,
  });
  output.addVideoTrack(video, { frameRate: fps });
  output.addAudioTrack(audio);
  let lastProgress = -1;

  try {
    await output.start();
    for (const segment of project.segments) {
      const input = openExportInput(segment.source);
      try {
        const [v, a] = await Promise.all([
          input.getPrimaryVideoTrack(),
          input.getPrimaryAudioTrack(),
        ]);
        if (!v) throw new Error("The video track is missing");
        const sink = new CanvasSink(v, {
          width,
          height,
          fit: "contain",
          poolSize: 2,
        });
        const from = Math.ceil((segment.startMs * fps) / 1000);
        const to = Math.ceil((segment.endMs * fps) / 1000);
        const samples = exportAudio(a, segment);
        let audioEnd = segment.startMs / 1000;
        const addAudio = async (until: number) => {
          while (audioEnd < until) {
            const next = await samples.next();
            if (next.done) break;
            const sample = next.value;
            try {
              await audio.add(sample);
              audioEnd = sample.timestamp + sample.duration;
            } finally {
              sample.close();
            }
          }
        };
        try {
          let frame = from;
          for await (const image of sink.canvasesAtTimestamps(
            sourceTimestamps(segment, from, to, fps),
          )) {
            const timestamp = frame / fps;
            const end = Math.min((frame + 1) / fps, project.durationMs / 1000);
            context.fillStyle = "#000";
            context.fillRect(0, 0, width, height);
            if (image) context.drawImage(image.canvas, 0, 0);
            context.drawImage(captions.render(timestamp * 1000), 0, 0);
            await Promise.all([
              video.add(timestamp, end - timestamp),
              addAudio(end),
            ]);
            const progress = Math.min(
              99,
              Math.floor((end * 100_000) / project.durationMs),
            );
            if (progress !== lastProgress) {
              report(progress);
              lastProgress = progress;
            }
            frame++;
          }
          await addAudio(Infinity);
        } finally {
          await samples.return(undefined);
        }
      } finally {
        input.dispose();
      }
    }
    video.close();
    audio.close();
    await output.finalize();
    return await file.getFile();
  } catch (error) {
    await output.cancel().catch(() => {});
    await writer.abort().catch(() => {});
    throw error;
  } finally {
    captions.destroy();
  }
}
