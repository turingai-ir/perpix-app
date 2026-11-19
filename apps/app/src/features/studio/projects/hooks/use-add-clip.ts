import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import { useFileManager } from "@/features/file-manager";
import { projectErrorKey } from "../model/project-error";
import {
  readClips,
  readVideoDuration,
  VIDEO_TYPES,
  writeClips,
} from "../model/clips";
import { editProject, getProject } from "../services/projects";
import { projectKey, projectsKey } from "./use-projects";
import { useRequestTranscript } from "./use-transcripts";

/** A video from the user's gallery, as the picker hands it over. */
export interface GalleryVideo {
  uuid: string;
  name: string;
  /** From the gallery's own record when it has one. */
  durationMs?: number;
  /** An address to read the length from when the gallery does not know it. */
  previewUrl?: string;
}

/**
 * Puts a video of the user's gallery into the project as its next clip and
 * asks for its subtitles. A video from the device is uploaded to the gallery
 * first and then added the same way, so the project only ever uses files that
 * live in the gallery.
 */
export function useAddClip(projectUuid: string) {
  const { t } = useAppTranslate();
  const client = useQueryClient();
  const { requestUpload, pendingUploads } = useFileManager(
    `studio:${projectUuid}`,
    { allowedFileTypes: VIDEO_TYPES },
  );
  const transcript = useRequestTranscript();
  const [busy, setBusy] = useState(false);

  const addToProject = async (video: GalleryVideo, durationMs: number) => {
    const current = await getProject(projectUuid);
    const clips = readClips(current.document);
    await editProject(projectUuid, {
      document: writeClips(current.document, [
        ...clips,
        {
          id: crypto.randomUUID(),
          file_uuid: video.uuid,
          name: video.name,
          duration_ms: durationMs,
          source_in_ms: 0,
          source_out_ms: durationMs,
        },
      ]),
      addFiles: [{ file_uuid: video.uuid, role: "SOURCE" }],
    });
    await Promise.all([
      client.invalidateQueries({ queryKey: projectKey(projectUuid) }),
      client.invalidateQueries({ queryKey: projectsKey }),
    ]);
    transcript.mutate(video.uuid);
  };

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    try {
      await task();
    } catch (error) {
      const key = projectErrorKey(error);
      const message =
        error instanceof Error &&
        key === "features.studio.projects.errors.generic"
          ? error.message
          : key
            ? t(key)
            : "";
      if (message) toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const unreadable = () => new Error(t("features.studio.clips.unreadable"));

  /** A video already in the gallery. */
  const addFromGallery = (video: GalleryVideo) =>
    run(async () => {
      const durationMs =
        video.durationMs ??
        (video.previewUrl
          ? await readVideoDuration(video.previewUrl).catch(() => {
              throw unreadable();
            })
          : null);
      if (durationMs === null) throw unreadable();
      await addToProject(video, durationMs);
    });

  /** A video from the device: into the gallery first, then into the project. */
  const uploadToGallery = (file: File) =>
    run(async () => {
      const durationMs = await readVideoDuration(file).catch(() => {
        throw unreadable();
      });
      const uuid = await requestUpload(file);
      await addToProject(
        { uuid, name: file.name.replace(/\.[^.]+$/, "") },
        durationMs,
      );
    });

  return { addFromGallery, uploadToGallery, busy, pendingUploads };
}
