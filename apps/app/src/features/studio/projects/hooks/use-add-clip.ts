import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SchemaStudioTranscriptLanguage } from "@/shared/api";
import { useAppTranslate } from "@/shared/hooks";
import { sessionStore } from "@/features/auth/session";
import { useFileManager } from "@/features/file-manager";
import { projectErrorKey } from "../model/project-error";
import {
  readClips,
  readVideoDuration,
  writeClips,
  type Clip,
} from "../model/clips";
import { getProject, saveProjectEdit } from "../services/projects";
import { extractLocalAudio } from "../services/local-audio";
import { removeLocalVideo, saveLocalVideo } from "../services/local-video";
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
 * Adds a gallery video or a device video with an uploaded audio track.
 */
export function useAddClip(projectUuid: string) {
  const { t } = useAppTranslate();
  const client = useQueryClient();
  const { requestUpload, pendingUploads } = useFileManager(
    `studio:${projectUuid}`,
    { allowedFileTypes: ["audio/mpeg"] },
  );
  const transcript = useRequestTranscript();
  const [busy, setBusy] = useState(false);
  const [preparingLocal, setPreparingLocal] = useState(false);

  const addToProject = async (
    clip: Clip,
    language: SchemaStudioTranscriptLanguage,
  ) => {
    const current = await getProject(projectUuid);
    const clips = readClips(current.document);
    await saveProjectEdit(current, {
      document: writeClips(current.document, [...clips, clip]),
      addFiles: [{ file_uuid: clip.file_uuid, role: "SOURCE" }],
    });
    transcript.mutate({
      file_uuid: clip.file_uuid,
      ...(language !== "auto" && { language }),
    });
    await Promise.all([
      client.invalidateQueries({ queryKey: projectKey(projectUuid) }),
      client.invalidateQueries({ queryKey: projectsKey }),
    ]);
  };

  const newClip = (
    fileUuid: string,
    name: string,
    durationMs: number,
  ): Clip => ({
    id: crypto.randomUUID(),
    file_uuid: fileUuid,
    name,
    duration_ms: durationMs,
    source_in_ms: 0,
    source_out_ms: durationMs,
  });

  const run = async (task: () => Promise<void>, local = false) => {
    setBusy(true);
    setPreparingLocal(local);
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
      setPreparingLocal(false);
      setBusy(false);
    }
  };

  const unreadable = () => new Error(t("features.studio.clips.unreadable"));

  /** A video already in the gallery. */
  const addFromGallery = (
    video: GalleryVideo,
    language: SchemaStudioTranscriptLanguage,
  ) =>
    run(async () => {
      const durationMs =
        video.durationMs ??
        (video.previewUrl
          ? await readVideoDuration(video.previewUrl).catch(() => {
              throw unreadable();
            })
          : null);
      if (durationMs === null) throw unreadable();
      await addToProject(newClip(video.uuid, video.name, durationMs), language);
    });

  const addLocalVideo = (
    file: File,
    language: SchemaStudioTranscriptLanguage,
  ) =>
    run(async () => {
      const cycle = sessionStore.getCycle();
      const durationMs = await readVideoDuration(file).catch(() => {
        throw unreadable();
      });
      const encoded = await extractLocalAudio(file);
      if (!encoded.ok)
        throw new Error(t(`features.studio.localVideo.${encoded.reason}`));
      if (cycle !== sessionStore.getCycle()) return;

      const id = crypto.randomUUID();
      await saveLocalVideo(projectUuid, id, file).catch((error: unknown) => {
        throw new Error(t("features.studio.localVideo.storage"), {
          cause: error,
        });
      });
      const name = file.name.replace(/\.[^.]+$/, "");
      let uuid: string | undefined;
      try {
        if (cycle !== sessionStore.getCycle()) return;
        setPreparingLocal(false);
        uuid = await requestUpload(
          new File([encoded.audio], `${name}.mp3`, { type: "audio/mpeg" }),
        );
        if (cycle !== sessionStore.getCycle()) return;
      } finally {
        if (cycle !== sessionStore.getCycle() || !uuid) {
          await removeLocalVideo(projectUuid, id).catch(() => {
            toast.error(t("features.studio.localVideo.cleanup"));
          });
        }
      }
      await addToProject(
        {
          ...newClip(uuid, name, durationMs),
          local_source: {
            id,
            fingerprint: encoded.fingerprint,
            size: file.size,
            content_type: file.type,
            audio_start_ms: encoded.audioStartMs,
          },
        },
        language,
      );
    }, true);

  return {
    addFromGallery,
    addLocalVideo,
    busy,
    preparingLocal,
    pendingUploads,
  };
}
