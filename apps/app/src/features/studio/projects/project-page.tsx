import { useRef, type ChangeEvent, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Camera, FolderUp, Loader2, Film, Play } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { useAppTranslate } from "@/shared/hooks";
import { FileManagerUploadStatus } from "@/features/file-manager";
import { APP_ROUTES_KEY, studioEditPath } from "@/app/router/routes";
import { StudioScreen } from "../shell/studio-screen";
import { ClipCard } from "./components/clip-card";
import { useAddClip } from "./hooks/use-add-clip";
import { useRemoveClip } from "./hooks/use-remove-clip";
import { useProject } from "./hooks/use-projects";
import { useRequestTranscript, useTranscripts } from "./hooks/use-transcripts";
import { readClips, VIDEO_TYPES } from "./model/clips";
import { isMissing } from "./model/project-error";

/** A project's screen: its videos in order, each with the state of its subtitles. */
export const ProjectPage: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { projectUuid = "" } = useParams();
  const project = useProject(projectUuid);
  const { add, busy, pendingUploads } = useAddClip(projectUuid);
  const removeClip = useRemoveClip(projectUuid);
  const requestTranscript = useRequestTranscript();
  const pickRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const clips = project.data ? readClips(project.data.document) : [];
  const transcripts = useTranscripts([
    ...new Set(clips.map((clip) => clip.file_uuid)),
  ]);
  const back = () => navigate(APP_ROUTES_KEY.studio.path, { replace: true });

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void add(file);
  };

  const uploading = [...pendingUploads.values()].filter(
    (item) => item.status === FileManagerUploadStatus.UPLOADING,
  );

  return (
    <StudioScreen
      title={project.data?.title ?? t("features.studio.projects.title")}
      onBack={back}
      actions={
        clips.length > 0 && (
          <Button
            size="sm"
            className="min-h-11 gap-2 rounded-full px-4"
            onClick={() => navigate(studioEditPath(projectUuid))}
          >
            <Play className="size-4" aria-hidden />
            {t("features.studio.editor.open")}
          </Button>
        )
      }
      footer={
        project.data && (
          <div className="flex shrink-0 gap-2 border-t px-4 py-3">
            <Button
              size="lg"
              className="min-h-12 flex-1 gap-2 text-base"
              disabled={busy}
              onClick={() => pickRef.current?.click()}
            >
              {busy ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <FolderUp className="size-5" aria-hidden />
              )}
              {t("features.studio.clips.add")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-12 gap-2"
              disabled={busy}
              aria-label={t("features.studio.clips.record")}
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="size-5" aria-hidden />
            </Button>
            <input
              ref={pickRef}
              type="file"
              accept={VIDEO_TYPES.join(",")}
              className="hidden"
              data-testid="clip-input"
              onChange={onPick}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="video/*"
              capture="environment"
              className="hidden"
              onChange={onPick}
            />
          </div>
        )
      }
    >
      {project.isPending ? (
        <Skeleton className="h-20 w-full" aria-hidden />
      ) : project.isError ? (
        isMissing(project.error) ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            {t("features.studio.projects.errors.missing")}
          </p>
        ) : (
          <ErrorSection onRetry={() => void project.refetch()} />
        )
      ) : clips.length === 0 && uploading.length === 0 ? (
        <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
          <Film className="text-muted-foreground size-12" aria-hidden />
          <p className="text-muted-foreground max-w-64 text-sm">
            {t("features.studio.clips.empty")}
          </p>
          <p className="text-muted-foreground max-w-64 text-xs">
            {t("features.studio.clips.limits")}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {clips.map((clip, index) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              index={index}
              transcript={transcripts.data?.find(
                (item) => item.file_uuid === clip.file_uuid,
              )}
              retrying={requestTranscript.isPending}
              onRetry={(item) => requestTranscript.mutate(item.file_uuid)}
              onRemove={(item) => removeClip.mutate(item.id)}
            />
          ))}
          {uploading.map((item) => (
            <li
              key={item.id}
              className="bg-card text-muted-foreground flex items-center gap-3 rounded-2xl border p-3 text-sm"
            >
              <Loader2 className="size-5 animate-spin" aria-hidden />
              <span className="truncate">
                {t("features.studio.clips.uploading", { name: item.name })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </StudioScreen>
  );
};
