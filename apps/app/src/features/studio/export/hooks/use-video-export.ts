import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ExportIssue,
  ExportOption,
  ExportProject,
  ExportRequest,
  ExportResponse,
} from "../model/video-export";
import { onSessionEnded } from "@/features/auth/session";
import { captureError } from "@/shared/lib/observability";
import { removeExport } from "../services/export-storage";

type WorkerJob = { worker: Worker; id: string };

function startWorker(
  request: ExportRequest,
  receive: (response: ExportResponse) => void,
) {
  try {
    const worker = new Worker(
      new URL("../services/export.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (event: MessageEvent<ExportResponse>) =>
      receive(event.data);
    worker.onerror = () => receive({ type: "error", issue: "failed" });
    worker.postMessage(request);
    return worker;
  } catch {
    return null;
  }
}

function discard(id: string) {
  void removeExport(id).catch(captureError);
}

export function useVideoExport(
  open: boolean,
  project: ExportProject | null,
  title: string,
) {
  const [options, setOptions] = useState<ExportOption[]>();
  const [issue, setIssue] = useState<ExportIssue>();
  const [progress, setProgress] = useState<number>();
  const [result, setResult] = useState<{ url: string; file: File }>();
  const [sharing, setSharing] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const [selected, select] = useState<string>();
  const active = useRef<WorkerJob | null>(null);
  const lastResult = useRef<{ id: string; url: string } | null>(null);

  const cancel = useCallback(() => {
    if (active.current) {
      const { worker, id } = active.current;
      active.current = null;
      worker.terminate();
      discard(id);
    }
  }, []);

  const releaseResult = useCallback(() => {
    if (lastResult.current) {
      const { id, url } = lastResult.current;
      lastResult.current = null;
      URL.revokeObjectURL(url);
      discard(id);
    }
  }, []);

  useEffect(
    () => () => {
      cancel();
      releaseResult();
    },
    [cancel, releaseResult],
  );

  useEffect(
    () =>
      onSessionEnded(() => {
        cancel();
        releaseResult();
        setResult(undefined);
      }),
    [cancel, releaseResult],
  );

  const segments = project?.segments;
  const durationMs = project?.durationMs;
  useEffect(() => {
    if (!open || !segments?.length || !durationMs) return;
    const finish = (response: ExportResponse) => {
      worker?.terminate();
      if (response.type === "options") {
        setOptions(response.options);
        select(response.options.find(({ format }) => format)?.profile.id);
        setIssue(response.issue);
      } else {
        setOptions([]);
        setIssue("device");
      }
    };
    const worker: Worker | null = startWorker(
      { type: "probe", durationMs, segments },
      finish,
    );
    const timeout = window.setTimeout(
      () => finish({ type: "error", issue: "device" }),
      worker ? 30_000 : 0,
    );
    if (worker) {
      const handler = worker.onmessage;
      worker.onmessage = (event) => {
        window.clearTimeout(timeout);
        handler?.call(worker, event);
      };
      worker.onerror = () => {
        window.clearTimeout(timeout);
        finish({ type: "error", issue: "device" });
      };
    }
    return () => {
      window.clearTimeout(timeout);
      worker?.terminate();
    };
  }, [open, segments, durationMs]);

  const start = () => {
    const option = options?.find(({ profile }) => profile.id === selected);
    if (active.current || sharing || !project || !option?.format) return;
    const { profile, format, hardwareAcceleration } = option;
    releaseResult();
    setResult(undefined);
    setIssue(undefined);
    setShareFailed(false);
    setProgress(0);
    const id = crypto.randomUUID();
    const worker = startWorker(
      { type: "render", id, project, profile, format, hardwareAcceleration },
      (response) => {
        if (active.current?.id !== id) return;
        if (response.type === "progress") {
          setProgress(response.progress);
        } else if (response.type === "done") {
          active.current?.worker.terminate();
          active.current = null;
          const name = title.trim().replace(/[\\/:*?"<>|]/g, "_") || "studio";
          const file = new File([response.file], `${name}.${format}`, {
            type: `video/${format}`,
          });
          const url = URL.createObjectURL(file);
          lastResult.current = { id, url };
          setResult({ url, file });
          setProgress(undefined);
        } else if (response.type === "error") {
          cancel();
          setIssue(response.issue);
          setProgress(undefined);
        }
      },
    );
    if (worker) active.current = { id, worker };
    else {
      setProgress(undefined);
      setIssue("device");
    }
  };

  const canShare =
    !!result &&
    typeof navigator.share === "function" &&
    navigator.canShare?.({ files: [result.file] }) === true;

  const share = async () => {
    if (!result || !canShare || sharing) return;
    setSharing(true);
    setShareFailed(false);
    try {
      await navigator.share({ files: [result.file] });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setShareFailed(true);
      }
    } finally {
      setSharing(false);
    }
  };

  const stop = () => {
    cancel();
    setProgress(undefined);
  };
  const reset = () => {
    stop();
    setOptions(undefined);
    setResult(undefined);
    setIssue(undefined);
    setShareFailed(false);
  };

  return {
    options,
    issue,
    progress,
    result,
    canShare,
    share,
    sharing,
    shareFailed,
    selected,
    select,
    start,
    stop,
    reset,
  };
}
