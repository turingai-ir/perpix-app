import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import type { ProjectSummary } from "../model/project";
import { projectErrorKey } from "../model/project-error";
import {
  createProject,
  deleteProject,
  renameProject,
} from "../services/projects";
import { removeLocalProjectVideos } from "../services/local-video";
import { projectRootKey, projectsKey } from "./use-projects";

type Pages = InfiniteData<{ items: ProjectSummary[]; has_next: boolean }>;

export function useProjectActions() {
  const client = useQueryClient();
  const { t } = useAppTranslate();

  const onError = (error: unknown) => {
    const key = projectErrorKey(error);
    if (key) toast.error(t(key));
  };
  const refresh = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: projectsKey }),
      client.invalidateQueries({ queryKey: projectRootKey }),
    ]);

  const create = useMutation({
    mutationFn: createProject,
    onError,
    onSuccess: refresh,
  });

  const rename = useMutation({
    mutationFn: ({ uuid, title }: { uuid: string; title: string }) =>
      renameProject(uuid, title),
    onError,
    onSettled: refresh,
  });

  // The card leaves the list at once; if the request fails it comes back.
  const remove = useMutation({
    mutationFn: deleteProject,
    onMutate: async (uuid) => {
      await client.cancelQueries({ queryKey: projectsKey });
      const saved = client.getQueriesData<Pages>({ queryKey: projectsKey });
      client.setQueriesData<Pages>(
        { queryKey: projectsKey },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.uuid !== uuid),
            })),
          },
      );
      return { saved };
    },
    onError: (error, _uuid, context) => {
      context?.saved.forEach(([key, data]) => client.setQueryData(key, data));
      onError(error);
    },
    onSuccess: (_, uuid) =>
      removeLocalProjectVideos(uuid).catch(() => {
        toast.error(t("features.studio.localVideo.cleanup"));
      }),
    onSettled: refresh,
  });

  return { create, rename, remove };
}
