import {
  AUDIO_BITRATE,
  AUDIO_RATE,
  EXPORT_PROFILES,
  EXPORT_LATENCY_MODE,
  type ExportAcceleration,
  type ExportOption,
  profileRestriction,
  type ExportFormat,
  type ExportProfile,
  type ExportRequest,
  type ExportResponse,
} from "../model/video-export";
import { canDecodeSources } from "./export-input";
import { exportDirectory, removeExport } from "./export-storage";

type ProbeRequest = Extract<ExportRequest, { type: "probe" }>;
type ProbeResponse = Extract<ExportResponse, { type: "options" }>;

async function measureEncoding(
  profile: ExportProfile,
  format: ExportFormat,
  hardwareAcceleration: ExportAcceleration,
) {
  const { width, height, fps, bitrate } = profile;
  const config: VideoEncoderConfig = {
    codec: format === "mp4" ? profile.avc : "vp8",
    width,
    height,
    bitrate,
    framerate: fps,
    latencyMode: EXPORT_LATENCY_MODE,
    hardwareAcceleration,
  };
  if (!(await VideoEncoder.isConfigSupported(config)).supported) return 0;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) return 0;

  let failed = false;
  let encoded = 0;
  const encoder = new VideoEncoder({
    output: () => {
      encoded++;
    },
    error: () => {
      failed = true;
    },
  });
  const frames = 12;
  try {
    encoder.configure(config);
    const start = performance.now();
    for (let index = 0; index < frames; index++) {
      context.fillStyle = index % 2 ? "#26364f" : "#142333";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#fff";
      context.font = "48px sans-serif";
      context.fillText("آزمایش ساخت خروجی", index * 5, height / 2);
      const frame = new VideoFrame(canvas, {
        timestamp: Math.round((index * 1e6) / fps),
      });
      try {
        encoder.encode(frame, { keyFrame: index === 0 });
      } finally {
        frame.close();
      }
    }
    await encoder.flush();
    return failed || encoded < frames
      ? 0
      : (frames * 1000) / Math.max(1, performance.now() - start);
  } catch {
    return 0;
  } finally {
    if (encoder.state !== "closed") encoder.close();
  }
}

export async function probeExport(
  request: ProbeRequest,
): Promise<ProbeResponse> {
  const result = { type: "options" } as const;
  if (
    typeof VideoEncoder === "undefined" ||
    typeof AudioEncoder === "undefined" ||
    typeof OffscreenCanvas === "undefined"
  )
    return { ...result, options: [], issue: "device" };

  let freeBytes = Infinity;
  try {
    const id = crypto.randomUUID();
    const handle = await (
      await exportDirectory()
    ).getFileHandle(id, { create: true });
    try {
      await (await handle.createWritable()).close();
    } finally {
      await removeExport(id);
    }
    const { quota, usage } = await navigator.storage.estimate();
    if (quota !== undefined && usage !== undefined) freeBytes = quota - usage;
  } catch {
    return { ...result, options: [], issue: "storage" };
  }

  if (!(await canDecodeSources(request.segments.map(({ source }) => source)))) {
    return { ...result, options: [], issue: "source" };
  }

  const formats: ExportFormat[] = [];
  for (const [format, codec] of [
    ["mp4", "mp4a.40.2"],
    ["webm", "opus"],
  ] as const) {
    try {
      const { supported } = await AudioEncoder.isConfigSupported({
        codec,
        sampleRate: AUDIO_RATE,
        numberOfChannels: 2,
        bitrate: AUDIO_BITRATE,
      });
      if (supported) formats.push(format);
    } catch {
      continue;
    }
  }

  if (formats.length === 0) return { ...result, options: [], issue: "device" };

  const options: ExportOption[] = [];
  for (const profile of EXPORT_PROFILES) {
    const issue = profileRestriction(profile, request.durationMs, freeBytes);
    options.push(
      issue ? { profile, issue } : await probeProfile(profile, formats),
    );
  }
  return { ...result, options };
}

async function probeProfile(
  profile: ExportProfile,
  formats: ExportFormat[],
): Promise<ExportOption> {
  const preferences: ExportAcceleration[] =
    profile.fps === 60
      ? ["prefer-hardware", "no-preference"]
      : ["no-preference"];
  for (const format of formats) {
    for (const hardwareAcceleration of preferences) {
      const speed = await measureEncoding(
        profile,
        format,
        hardwareAcceleration,
      ).catch(() => 0);
      if (speed > 0)
        return {
          profile,
          format,
          hardwareAcceleration,
          slow: speed < profile.fps,
        };
    }
  }
  return { profile, issue: "device" };
}
