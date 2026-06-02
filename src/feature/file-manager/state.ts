import { atom } from "jotai";

export enum FileManagerPendingUploadStatus {
  UPLOADING = "UPLOADING",
  FAILED = "FAILED",
}

export interface PendingFile {
  file: File;
  name: string;
  status: FileManagerPendingUploadStatus;
}

export const filesPreviewAtom = atom<Map<string, string>>(new Map());

export const pendingUploadsGroupedAtom = atom<
  Map<string, Map<string, PendingFile>>
>(new Map());
