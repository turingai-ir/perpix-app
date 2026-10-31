import { apiClient } from "@/services/api";
import { previewListSchema, type FilePreviewUrls } from "../model/contracts";
import { fileError, responseError } from "../model/file-error";

type Request = {
  id: string;
  resolve: (file: FilePreviewUrls) => void;
  reject: (error: unknown) => void;
};
const pending: Request[] = [];
let running = 0;
let scheduled = false;
export function loadPreview(id: string): Promise<FilePreviewUrls> {
  return new Promise((resolve, reject) => {
    pending.push({ id, resolve, reject });
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      drain();
    });
  });
}
function drain() {
  while (running < 3 && pending.length) {
    const batch = pending.splice(0, 20);
    running++;
    void loadBatch(batch).finally(() => {
      running--;
      drain();
    });
  }
}
async function loadBatch(batch: Request[]): Promise<void> {
  try {
    const { data, response } = await apiClient.POST(
      "/api/v1/file-manager/files/presigned-urls",
      { body: { file_uuids: batch.map(({ id }) => id) } },
    );
    if (!response.ok) throw responseError(response.status);
    const result = new Map(
      previewListSchema.parse(data).files.map((file) => [file.file_uuid, file]),
    );
    batch.forEach((request) => {
      const file = result.get(request.id);
      if (file) request.resolve(file);
      else request.reject(responseError(404));
    });
  } catch (error) {
    if (fileError(error).status === 404 && batch.length > 1) {
      const middle = Math.ceil(batch.length / 2);
      await loadBatch(batch.slice(0, middle));
      await loadBatch(batch.slice(middle));
    } else batch.forEach((request) => request.reject(fileError(error)));
  }
}
