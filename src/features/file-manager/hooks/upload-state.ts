import { atom, useAtom } from "jotai";

export enum FileManagerUploadStatus {
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  FAILED = "FAILED",
}
export interface PendingFile {
  id: string;
  file: File;
  name: string;
  status: FileManagerUploadStatus;
  errorKey?: string;
}
export const pendingUploadsGroupedAtom = atom<
  Map<string, Map<string, PendingFile>>
>(new Map());
export function useUploadState(scope: string) {
  const [groups, setGroups] = useAtom(pendingUploadsGroupedAtom);
  const update = (id: string, item?: PendingFile) =>
    setGroups((previous) => {
      const next = new Map(previous),
        group = new Map(next.get(scope));
      if (item) group.set(id, item);
      else group.delete(id);
      if (group.size) next.set(scope, group);
      else next.delete(scope);
      return next;
    });
  return {
    pendingUploads: groups.get(scope) ?? new Map<string, PendingFile>(),
    start: (id: string, file: File) =>
      update(id, {
        id,
        file,
        name: file.name,
        status: FileManagerUploadStatus.UPLOADING,
      }),
    fail: (id: string, file: File, errorKey: string) =>
      update(id, {
        id,
        file,
        name: file.name,
        errorKey,
        status: FileManagerUploadStatus.FAILED,
      }),
    removePendingUpload: (id: string) => update(id),
  };
}
