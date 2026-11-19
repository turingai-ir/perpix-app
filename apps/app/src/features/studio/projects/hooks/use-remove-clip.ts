import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import { readClips, writeClips } from "../model/clips";
import { projectErrorKey } from "../model/project-error";
import { editProject, getProject } from "../services/projects";
import { projectKey, projectsKey } from "./use-projects";

export function useRemoveClip(projectUuid: string) {
  const client = useQueryClient();
  const { t } = useAppTranslate();
  return useMutation({
    mutationFn: async (clipId: string) => {
      const current = await getProject(projectUuid);
      const clips = readClips(current.document);
      const gone = clips.find((clip) => clip.id === clipId);
      const rest = clips.filter((clip) => clip.id !== clipId);
      // The file leaves the project only when no other clip still uses it.
      const unused =
        gone && !rest.some((clip) => clip.file_uuid === gone.file_uuid);
      return editProject(projectUuid, {
        document: writeClips(current.document, rest),
        dropFiles: unused ? [gone.file_uuid] : [],
      });
    },
    onError: (error) => {
      const key = projectErrorKey(error);
      if (key) toast.error(t(key));
    },
    onSettled: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: projectKey(projectUuid) }),
        client.invalidateQueries({ queryKey: projectsKey }),
      ]),
  });
}
