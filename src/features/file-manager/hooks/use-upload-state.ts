import { atom, useAtom, getDefaultStore } from "jotai";
import { onSessionEnded } from "@/features/auth/session";
import { FileManagerUploadStatus, type PendingFile } from "../model/types";

const uploadsAtom = atom<ReadonlyMap<string, ReadonlyMap<string, PendingFile>>>(
  new Map(),
);
onSessionEnded(() => getDefaultStore().set(uploadsAtom, new Map()));
export function useUploadState(scope: string) {
  const [groups, setGroups] = useAtom(uploadsAtom);
  const pendingUploads = groups.get(scope) ?? new Map<string, PendingFile>();
  const update = (id: string, item?: PendingFile) =>
    setGroups((current) => {
      const groups = new Map(current);
      const group = new Map(groups.get(scope));
      if (item) group.set(id, item);
      else group.delete(id);
      if (group.size) groups.set(scope, group);
      else groups.delete(scope);
      return groups;
    });
  return {
    pendingUploads,
    removePendingUpload: (id: string) => update(id),
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
  };
}
