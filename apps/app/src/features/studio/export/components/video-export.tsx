import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { BottomSheet } from "../../ui/bottom-sheet";
import { estimatedBytes, type ExportProject } from "../model/video-export";
import { useVideoExport } from "../hooks/use-video-export";

const number = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });

interface VideoExportProps {
  project: ExportProject | null;
  loading: boolean;
  captionsPending: boolean;
  title: string;
  onOpen: () => void;
}

export function VideoExport({
  project,
  loading,
  captionsPending,
  title,
  onOpen,
}: VideoExportProps) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const job = useVideoExport(open, project, title);
  const busy = job.progress !== undefined;
  const issue = loading ? undefined : !project ? "source" : job.issue;
  const canStart =
    !!project &&
    !!job.options?.some(
      (option) => option.format && option.profile.id === job.selected,
    );

  return (
    <>
      <Button
        size="sm"
        className="gap-2"
        onClick={() => {
          onOpen();
          setOpen(true);
        }}
      >
        <Download className="size-4" aria-hidden />
        {t("features.studio.export.title")}
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={(next) => {
          if (!next && job.sharing) return;
          if (!next) job.reset();
          setOpen(next);
        }}
        title={t("features.studio.export.title")}
      >
        <div className="flex flex-col gap-group">
          {loading || (project && !job.options && !issue) ? (
            <p role="status" className="text-body text-muted-foreground">
              {t("features.studio.export.checking")}
            </p>
          ) : null}
          {issue && (
            <p role="status" className="text-body text-muted-foreground">
              {t(`features.studio.export.${issue}`)}
            </p>
          )}
          {project && !!job.options?.length && (
            <fieldset className="flex flex-col gap-group" disabled={busy}>
              <legend className="mb-2 text-headline font-medium">
                {t("features.studio.export.quality")}
              </legend>
              {job.options.map(({ profile, format, issue: reason, slow }) => (
                <label
                  key={profile.id}
                  htmlFor={`studio-export-${profile.id}`}
                  aria-label={t("features.studio.export.profile", {
                    resolution: number.format(profile.width),
                    fps: number.format(profile.fps),
                  })}
                  className="flex items-start gap-3 rounded-card border p-3"
                >
                  <input
                    id={`studio-export-${profile.id}`}
                    type="radio"
                    name="studio-export-profile"
                    value={profile.id}
                    checked={job.selected === profile.id}
                    disabled={!format}
                    onChange={() => job.select(profile.id)}
                  />
                  <span>
                    <span className="block text-body">
                      {t("features.studio.export.profile", {
                        resolution: number.format(profile.width),
                        fps: number.format(profile.fps),
                      })}
                    </span>
                    <span className="block text-footnote text-muted-foreground">
                      {format
                        ? t("features.studio.export.size", {
                            format: format.toUpperCase(),
                            size: number.format(
                              estimatedBytes(profile, project.durationMs) /
                                1_000_000,
                            ),
                          })
                        : t(
                            `features.studio.export.${reason === "storage" ? "storage" : "deviceProfile"}`,
                          )}
                    </span>
                    {slow && (
                      <span className="block text-footnote text-muted-foreground">
                        {t("features.studio.export.slow")}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </fieldset>
          )}
          {captionsPending && (
            <p role="status" className="text-footnote text-muted-foreground">
              {t("features.studio.export.captionsPending")}
            </p>
          )}
          {busy ? (
            <>
              <progress
                aria-label={t("features.studio.export.progress")}
                max={100}
                value={job.progress}
                className="w-full"
              />
              <Button variant="outline" onClick={job.stop}>
                {t("features.studio.export.cancel")}
              </Button>
            </>
          ) : (
            <Button
              disabled={loading || captionsPending || job.sharing || !canStart}
              onClick={job.start}
            >
              {t("features.studio.export.start")}
            </Button>
          )}
          {job.result && (
            <div className="flex flex-wrap items-center justify-center gap-group">
              <a
                className="text-body text-primary underline"
                href={job.result.url}
                download={job.result.file.name}
              >
                {t("features.studio.export.download")}
              </a>
              {job.canShare && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => void job.share()}
                  disabled={job.sharing}
                >
                  <Share2 className="size-4" aria-hidden />
                  {t("features.studio.export.share")}
                </Button>
              )}
            </div>
          )}
          {job.shareFailed && (
            <p role="status" className="text-footnote text-muted-foreground">
              {t("features.studio.export.shareFailed")}
            </p>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
