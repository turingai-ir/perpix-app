import { apiClient } from "@/services/api/client";
import { httpError, toFileManagerError } from "../model/errors";
import { previewsSchema, type FilePreviewUrls } from "../model/types";

interface WaitingPreview {
  id: string;
  resolve: (preview: FilePreviewUrls) => void;
  reject: (error: unknown) => void;
}
const queue: WaitingPreview[] = [];
let active = 0;
let scheduled = false;

/** Share requests across consumers, with at most three batches in flight. */
export function requestPreview(id: string): Promise<FilePreviewUrls> {
  return new Promise((resolve, reject) => {
    queue.push({ id, resolve, reject });
    if (!scheduled) {
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        drain();
      });
    }
  });
}
function drain() {
  while (active < 3 && queue.length) {
    const batch = queue.splice(0, 20);
    active++;
    void resolveBatch(batch).finally(() => {
      active--;
      drain();
    });
  }
}
async function resolveBatch(batch: WaitingPreview[]): Promise<void> {
  try {
    const { data, response } = await apiClient.POST(
      "/api/v1/file-manager/files/presigned-urls",
      {
        body: { file_uuids: batch.map(({ id }) => id) },
      },
    );
    if (!response.ok) throw httpError(response.status);
    const parsed = previewsSchema.parse(data);
    const byId = new Map(parsed.files.map((file) => [file.file_uuid, file]));
    batch.forEach((item) => {
      const preview = byId.get(item.id);
      if (preview) item.resolve(preview);
      else item.reject(httpError(404));
    });
  } catch (error) {
    const typed = toFileManagerError(error);
    // A missing UUID fails the server's whole batch. Isolate it without
    // rejecting healthy files or issuing an unbounded burst of requests.
    if (typed.status === 404 && batch.length > 1) {
      const middle = Math.ceil(batch.length / 2);
      await resolveBatch(batch.slice(0, middle));
      await resolveBatch(batch.slice(middle));
    } else batch.forEach((item) => item.reject(typed));
  }
}
