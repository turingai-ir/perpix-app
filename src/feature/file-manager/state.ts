import { atom } from "jotai";

export enum FileManagerUploadStatus {
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  FAILED = "FAILED",
}

export interface PendingFile {
  file: File;
  name: string;
  status: FileManagerUploadStatus;
}

export const pendingUploadsGroupedAtom = atom<
  Map<string, Map<string, PendingFile>>
>(new Map());
