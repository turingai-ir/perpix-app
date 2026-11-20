import type { CaptionTemplate, CaptionWord } from "@perpix/caption-renderer";

export const EXPORT_PROFILES = [
  {
    id: "480",
    width: 480,
    height: 854,
    fps: 24,
    bitrate: 1_600_000,
    avc: "avc1.42001f",
  },
  {
    id: "720",
    width: 720,
    height: 1280,
    fps: 30,
    bitrate: 3_500_000,
    avc: "avc1.420020",
  },
  {
    id: "1080",
    width: 1080,
    height: 1920,
    fps: 30,
    bitrate: 6_000_000,
    avc: "avc1.420028",
  },
  {
    id: "1080-60",
    width: 1080,
    height: 1920,
    fps: 60,
    bitrate: 9_000_000,
    avc: "avc1.42002a",
  },
] as const;

export const AUDIO_RATE = 48_000;
export const AUDIO_BITRATE = 128_000;
export type ExportProfile = (typeof EXPORT_PROFILES)[number];
export const EXPORT_LATENCY_MODE = "quality";
export type ExportAcceleration = "prefer-hardware" | "no-preference";
export type ExportFormat = "mp4" | "webm";
export type ExportIssue = "device" | "storage" | "source" | "failed";

export interface ExportOption {
  profile: ExportProfile;
  format?: ExportFormat;
  hardwareAcceleration?: ExportAcceleration;
  slow?: boolean;
  issue?: ExportIssue;
}

export interface ExportSegment {
  source: string | Blob;
  sourceInMs: number;
  startMs: number;
  endMs: number;
}

export interface ExportProject {
  durationMs: number;
  segments: ExportSegment[];
  words: readonly CaptionWord[];
  template: CaptionTemplate;
}

export type ExportRequest =
  | { type: "probe"; durationMs: number; segments: ExportSegment[] }
  | {
      type: "render";
      id: string;
      project: ExportProject;
      profile: ExportProfile;
      format: ExportFormat;
      hardwareAcceleration?: ExportAcceleration;
    };

export type ExportResponse =
  | { type: "options"; options: ExportOption[]; issue?: ExportIssue }
  | { type: "progress"; progress: number }
  | { type: "done"; file: File }
  | { type: "error"; issue: ExportIssue };

export const estimatedBytes = (profile: ExportProfile, durationMs: number) =>
  Math.ceil(((profile.bitrate + AUDIO_BITRATE) * durationMs) / 8000);

export const storageBytes = (profile: ExportProfile, durationMs: number) =>
  Math.ceil(1.25 * estimatedBytes(profile, durationMs) + 16 * 1024 * 1024);

export function profileRestriction(
  profile: ExportProfile,
  durationMs: number,
  freeBytes: number,
): "storage" | undefined {
  return freeBytes < storageBytes(profile, durationMs) ? "storage" : undefined;
}
