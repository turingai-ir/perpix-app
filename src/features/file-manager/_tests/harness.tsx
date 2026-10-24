import { createRoot } from "react-dom/client";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { MediaUploadStrip } from "@/feature/media-uploader";
import {
  useFileManager,
  useFilesPreviews,
  useFilePreview,
  useDeleteUserFile,
  useReplaceUserFile,
  useInfiniteUserFiles,
} from "@/feature/file-manager";

function Harness() {
  const { requestUpload, pendingUploads } = useFileManager("test", {
    allowedFileTypes: ["audio/*"],
  });
  const [result, setResult] = useState("");
  const [count, setCount] = useState(20);
  const ids = Array.from({ length: count }, (_, i) => `file-${i}`);
  const { getFilesPreviewsState } = useFilesPreviews(ids);
  const single = useFilePreview("file-0").getFilePreviewState;
  const { deleteFileState } = useDeleteUserFile();
  const { replaceFileState } = useReplaceUserFile();
  const files = useInfiniteUserFiles({
    contentTypes: ["audio/mpeg"],
  }).getUserFilesState;
  return (
    <>
      <label>
        Upload
        <input
          type="file"
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            try {
              setResult(await requestUpload(file));
            } catch (error) {
              setResult(error instanceof Error ? error.message : "error");
            }
          }}
        />
      </label>
      <output aria-label="Upload result">{result}</output>
      <output aria-label="Pending">{pendingUploads.size}</output>
      <button type="button" onClick={() => setCount(40)}>
        More files
      </button>
      <button type="button" onClick={() => setCount(1000)}>
        Many files
      </button>
      <button
        type="button"
        onClick={() => {
          void deleteFileState.mutateAsync("file-0").catch(() => {});
        }}
      >
        Delete file
      </button>
      <button
        type="button"
        onClick={() => {
          void replaceFileState
            .mutateAsync({
              fileUuid: "file-0",
              file: new File(["sound"], "sound.mp3", { type: "audio/mpeg" }),
            })
            .catch(() => {});
        }}
      >
        Replace file
      </button>
      <output aria-label="Files">
        {files.data?.pages
          .flatMap((page) => page.files)
          .map((file) => file.uuid)
          .join(",")}
      </output>
      <output aria-label="Mutation error">
        {deleteFileState.error?.message ?? replaceFileState.error?.message}
      </output>
      <output aria-label="Single preview">{single.data?.preview_url}</output>
      <output aria-label="Single preview error">
        {String(single.isError)}
      </output>
      <output aria-label="Previews">
        {Object.keys(getFilesPreviewsState.data ?? {}).length}
      </output>
    </>
  );
}

export function mount() {
  queryClient.clear();
  const node = document.createElement("div");
  document.body.replaceChildren(node);
  createRoot(node).render(
    <QueryClientProvider client={queryClient}>
      <Harness />
    </QueryClientProvider>,
  );
}

export function mountPicker() {
  queryClient.clear();
  const node = document.createElement("div");
  document.body.replaceChildren(node);
  createRoot(node).render(
    <QueryClientProvider client={queryClient}>
      <MediaUploadStrip
        label="Choose file"
        accept="image/*,video/*,audio/*"
        uploadedItems={[]}
        localItems={[]}
      />
    </QueryClientProvider>,
  );
}
