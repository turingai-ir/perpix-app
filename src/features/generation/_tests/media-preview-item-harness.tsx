import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { queryClient } from "@/shared/lib/react-query";
import { MediaPreviewItem } from "../media-preview-item";

const fileUuid = "22222222-2222-4222-8222-222222222224";

export function mount(alt: string, index?: number) {
  const host = document.createElement("div");
  document.body.replaceChildren(host);
  queryClient.setQueryData(["file-manager", "preview", fileUuid], {
    file_uuid: fileUuid,
    preview_url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
    download_url: "data:text/plain,mocked-image",
  });
  createRoot(host).render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MediaPreviewItem
          fileId={fileUuid}
          type="image"
          alt={alt}
          index={index}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
