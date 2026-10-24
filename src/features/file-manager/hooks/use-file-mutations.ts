import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAppTranslate } from "@/hooks/i18";
import type { SchemaFileManagerUserFilesResponse } from "@/services/api/api";
import { deleteFile, replaceFile } from "../services/files";
import { previewKey, userFilesKey } from "../model/types";
import {
  isTemporary,
  toFileManagerError,
  UserFileError,
} from "../model/errors";

type FilesData = InfiniteData<SchemaFileManagerUserFilesResponse>;
export function useDeleteUserFile() {
  const client = useQueryClient();
  const { t } = useAppTranslate();
  const deleteFileState = useMutation({
    mutationKey: ["file-manager", "delete"],
    mutationFn: async (id: string) => {
      try {
        await deleteFile(id);
      } catch (error) {
        throw new UserFileError(t(toFileManagerError(error).key), error);
      }
    },
    retry: false,
    networkMode: "always",
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: userFilesKey });
      const previous = client.getQueriesData<FilesData>({
        queryKey: userFilesKey,
      });
      client.setQueriesData<FilesData>(
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
      return previous;
    },
    onError: (_error, id, previous) =>
      previous?.forEach(([key, snapshot]) => {
        client.setQueryData<FilesData>(key, (current) => {
          if (!current || !snapshot) return current;
          return {
            ...current,
            pages: current.pages.map((page, index) => {
              const original = snapshot.pages[index]?.files;
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
        });
      }),
    onSuccess: (_data, id) => client.resetQueries({ queryKey: previewKey(id) }),
    onSettled: () => {
      if (
        client.isMutating({ mutationKey: ["file-manager", "delete"] }) === 1
      ) {
        return client.invalidateQueries({ queryKey: userFilesKey });
      }
    },
  });
  return { deleteFileState };
}
export function useReplaceUserFile() {
  const client = useQueryClient();
  const { t } = useAppTranslate();
  const replaceFileState = useMutation({
    mutationFn: async (input: Parameters<typeof replaceFile>[0]) => {
      try {
        return await replaceFile(input);
      } catch (error) {
        const key = isTemporary(error)
          ? "features.fileManager.errors.unknownReplace"
          : toFileManagerError(error).key;
        throw new UserFileError(t(key), error);
      }
    },
    retry: false,
    networkMode: "always",
    onSettled: async (_data, _error, { fileUuid }) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: userFilesKey }),
        client.invalidateQueries({ queryKey: previewKey(fileUuid) }),
      ]);
    },
  });
  return { replaceFileState };
}
