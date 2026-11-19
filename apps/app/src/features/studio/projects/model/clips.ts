import { z } from "zod";

/** One video in the project: which file, which part of it, and its name for the user. */
export const clipSchema = z.object({
  id: z.string(),
  file_uuid: z.string(),
  name: z.string(),
  duration_ms: z.number().nonnegative(),
  source_in_ms: z.number().nonnegative(),
  source_out_ms: z.number().nonnegative(),
});
export type Clip = z.infer<typeof clipSchema>;

const videoTrackSchema = z.object({
  kind: z.literal("video"),
  clips: z.array(z.unknown()),
});

/** Clips that are valid; anything the studio cannot read is skipped, never thrown. */
export const readClips = (document: Record<string, unknown>): Clip[] => {
  const tracks = Array.isArray(document.tracks) ? document.tracks : [];
  const track = tracks
    .map((item) => videoTrackSchema.safeParse(item))
    .find((result) => result.success);
  if (!track?.success) return [];
  return track.data.clips.flatMap((item) => {
    const clip = clipSchema.safeParse(item);
    return clip.success ? [clip.data] : [];
  });
};

/** The document with its video track replaced by these clips; every other track is kept. */
export const writeClips = (
  document: Record<string, unknown>,
  clips: Clip[],
): Record<string, unknown> => {
  const tracks = Array.isArray(document.tracks) ? [...document.tracks] : [];
  const index = tracks.findIndex(
    (item) => videoTrackSchema.safeParse(item).success,
  );
  const video = { kind: "video", clips };
  if (index >= 0) tracks[index] = video;
  else tracks.unshift(video);
  return { ...document, tracks };
};

export const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

/** The length of a video on this device, read before it is uploaded. */
export const readVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    const done = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      video.load();
    };
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const ms = Math.round(video.duration * 1000);
      done();
      if (Number.isFinite(ms) && ms > 0) resolve(ms);
      else reject(new Error("video has no readable duration"));
    };
    video.onerror = () => {
      done();
      reject(new Error("video cannot be read"));
    };
    video.src = url;
  });

export const formatDuration = (ms: number): string => {
  const total = Math.round(ms / 1000);
  const text = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  return text.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
};
