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

/**
 * Adds a video to the project: reads its length, uploads it, saves it as the
 * project's next clip, and asks for its subtitles. Each step reports its own
 * failure, and a file that is already uploaded is never uploaded twice.
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

  const add = async (file: File) => {
    setBusy(true);
    try {
      const duration = await readVideoDuration(file).catch(() => {
        throw new Error(t("features.studio.clips.unreadable"));
      });
      const fileUuid = await requestUpload(file);
      const current = await getProject(projectUuid);
      const clips = readClips(current.document);
      const next = [
        ...clips,
        {
          id: crypto.randomUUID(),
          file_uuid: fileUuid,
          name: file.name.replace(/\.[^.]+$/, ""),
          duration_ms: duration,
          source_in_ms: 0,
          source_out_ms: duration,
        },
      ];
      await editProject(projectUuid, {
        document: writeClips(current.document, next),
        addFiles: [{ file_uuid: fileUuid, role: "SOURCE" }],
      });
      await Promise.all([
        client.invalidateQueries({ queryKey: projectKey(projectUuid) }),
        client.invalidateQueries({ queryKey: projectsKey }),
      ]);
      transcript.mutate(fileUuid);
    } catch (error) {
      const key = projectErrorKey(error);
      toast.error(
        error instanceof Error &&
          key === "features.studio.projects.errors.generic"
          ? error.message
          : key
            ? t(key)
            : "",
      );
    } finally {
      setBusy(false);
    }
  };

  return { add, busy, pendingUploads };
}
