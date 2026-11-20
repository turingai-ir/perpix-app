import type { ExportRequest, ExportResponse } from "../model/video-export";
import { probeExport } from "./export-capabilities";
import { renderVideo } from "./render-video";

const send = (message: ExportResponse) => self.postMessage(message);

self.onmessage = (event: MessageEvent<ExportRequest>) => {
  const request = event.data;
  const run = async () => {
    if (request.type === "probe") {
      send(await probeExport(request));
    } else {
      const file = await renderVideo(request, (progress) =>
        send({ type: "progress", progress }),
      );
      send({ type: "done", file });
    }
  };
  void run().catch((error: unknown) => {
    send({
      type: "error",
      issue:
        error instanceof DOMException && error.name === "QuotaExceededError"
          ? "storage"
          : "failed",
    });
  });
};
