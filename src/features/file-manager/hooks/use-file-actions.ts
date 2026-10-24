import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAppTranslate } from "@/hooks";
import { deleteUserFile, replaceUserFile } from "../services/file-actions";
import {
  fileError,
  canRetryFileRequest,
  UserFileError,
} from "../model/file-error";
import {
  previewKey,
  userFilesKey,
  type UserFileItem,
} from "../model/contracts";

type Files = InfiniteData<{
  files: readonly UserFileItem[];
  has_next: boolean;
}>;
export function useDeleteUserFile() {
  const client = useQueryClient(),
    { t } = useAppTranslate();
  const deleteFileState = useMutation({
    mutationKey: ["file-manager", "delete"],
    networkMode: "always",
    retry: false,
    mutationFn: async (id: string) => {
      try {
        await deleteUserFile(id);
      } catch (error) {
        throw new UserFileError(t(fileError(error).key), error);
      }
    },
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: userFilesKey });
      const snapshots = client.getQueriesData<Files>({
        queryKey: userFilesKey,
      });
      client.setQueriesData<Files>(
        { queryKey: userFilesKey },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              files: page.files.filter((file) => file.uuid !== id),
            })),
          },
      );
      return snapshots;
    },
    onError: (_error, id, snapshots) =>
      snapshots?.forEach(([key, saved]) =>
        client.setQueryData<Files>(key, (current) => {
          if (!current || !saved) return current;
          return {
            ...current,
            pages: current.pages.map((page, index) => {
              const original = saved.pages[index]?.files;
              const position =
                original?.findIndex((file) => file.uuid === id) ?? -1;
              const restored = original?.[position];
              if (!restored || page.files.some((file) => file.uuid === id))
                return page;
              const files = [...page.files];
              files.splice(position, 0, restored);
              return { ...page, files };
            }),
          };
        }),
      ),
    onSuccess: (_data, id) => client.resetQueries({ queryKey: previewKey(id) }),
    onSettled: () => {
      if (client.isMutating({ mutationKey: ["file-manager", "delete"] }) === 1)
        return client.invalidateQueries({ queryKey: userFilesKey });
    },
  });
  return { deleteFileState };
}
export function useReplaceUserFile() {
  const client = useQueryClient(),
    { t } = useAppTranslate();
  const replaceFileState = useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: async (input: Parameters<typeof replaceUserFile>[0]) => {
      try {
        return await replaceUserFile(input);
      } catch (error) {
        throw new UserFileError(
          t(
            canRetryFileRequest(error)
              ? "features.fileManager.errors.unknownReplace"
              : fileError(error).key,
          ),
          error,
        );
      }
    },
    onSettled: async (_data, _error, { fileUuid }) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: userFilesKey }),
        client.invalidateQueries({ queryKey: previewKey(fileUuid) }),
      ]);
    },
  });
  return { replaceFileState };
}
