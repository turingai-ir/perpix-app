import { createRoot } from "react-dom/client";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import {
  useFileManager,
  useFilesPreviews,
  useFilePreview,
  useDeleteUserFile,
  useReplaceUserFile,
  useInfiniteUserFiles,
} from "@/feature/file-manager";
import { MediaUploadStrip } from "@/feature/media-uploader";

function Harness() {
  const [result, setResult] = useState("");
  const [count, setCount] = useState(20);
  const { requestUpload } = useFileManager("integration", {
    allowedFileTypes: ["audio/*"],
  });
  const { getFilesPreviewsState } = useFilesPreviews(
    Array.from({ length: count }, (_, i) => `file-${i}`),
  );
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
      <output aria-label="Result">{result}</output>
      <output aria-label="Single URL">{single.data?.preview_url}</output>
      <output aria-label="Files">
        {files.data?.pages
          .flatMap((page) => page.files)
          .map((file) => file.uuid)
          .join(",")}
      </output>
      <output aria-label="Action error">
        {deleteFileState.error?.message ?? replaceFileState.error?.message}
      </output>
      <button
        type="button"
        onClick={() => {
          void deleteFileState.mutateAsync("file-0").catch(() => {});
        }}
      >
        Delete
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
        Replace
      </button>
      <output aria-label="Previews">
        {Object.keys(getFilesPreviewsState.data ?? {}).length}
      </output>
      <button type="button" onClick={() => setCount(40)}>
        More
      </button>
      <button type="button" onClick={() => setCount(1000)}>
        Many
      </button>
    </>
  );
}
export function mount() {
  queryClient.clear();
  const host = document.createElement("div");
  document.body.replaceChildren(host);
  createRoot(host).render(
    <QueryClientProvider client={queryClient}>
      <Harness />
    </QueryClientProvider>,
  );
}

function Picker() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <QueryClientProvider client={queryClient}>
      <MediaUploadStrip
        accept="image/*"
        maxItems={2}
        label="Choose file"
        uploadedItems={selected.map((id) => ({ id }))}
        localItems={[]}
        onUploadedFileSelect={(id) =>
          setSelected((current) => [...current, id])
        }
      />
      <output aria-label="Selection">{selected.join(",")}</output>
    </QueryClientProvider>
  );
}
export function mountPicker() {
  queryClient.clear();
  const host = document.createElement("div");
  document.body.replaceChildren(host);
  createRoot(host).render(<Picker />);
}
