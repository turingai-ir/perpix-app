import { useCallback, useMemo, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";

import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { useAppTranslate } from "@/shared/hooks";
import { useFilesPreviews } from "@/features/file-manager";
import { studioProjectPath } from "@/app/router/routes";
import { StudioScreen } from "../shell/studio-screen";
import { useProject } from "../projects/hooks/use-projects";
import { useTranscripts } from "../projects/hooks/use-transcripts";
import { readClips } from "../projects/model/clips";
import { isMissing } from "../projects/model/project-error";
import { EditorStage } from "./components/editor-stage";
import { PlayerBar } from "./components/player-bar";
import { useCaptionTemplate } from "./hooks/use-caption-template";
import { usePlayer } from "./hooks/use-player";
import { useTimelineWords } from "./hooks/use-timeline-words";
import { buildTimeline } from "./model/timeline";

/** The editor: the project's clips played in order, with the captions on top. */
export const EditorPage: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { projectUuid = "" } = useParams();
  const project = useProject(projectUuid);

  const clips = useMemo(
    () => (project.data ? readClips(project.data.document) : []),
    [project.data],
  );
  const timeline = useMemo(() => buildTimeline(clips), [clips]);
  const fileUuids = useMemo(
    () => [...new Set(clips.map((clip) => clip.file_uuid))],
    [clips],
  );

  const { getFilesPreviewsState } = useFilesPreviews(fileUuids);
  const previews = getFilesPreviewsState.data;
  const urlFor = useCallback(
    (fileUuid: string) => previews[fileUuid]?.preview_url,
    [previews],
  );

  const transcripts = useTranscripts(fileUuids);
  const { words, pending } = useTimelineWords(timeline, transcripts.data);
  const template = useCaptionTemplate();
  const player = usePlayer(timeline, urlFor);

  const back = () =>
    navigate(studioProjectPath(projectUuid), { replace: true });

  return (
    <StudioScreen
      title={project.data?.title ?? t("features.studio.projects.title")}
      onBack={back}
      className="flex flex-col overflow-hidden p-0"
      footer={
        timeline.durationMs > 0 && (
          <PlayerBar
            timeMs={player.timeMs}
            durationMs={timeline.durationMs}
            playing={player.playing}
            onToggle={player.toggle}
            onSeek={player.seek}
          />
        )
      }
    >
      {project.isPending ? (
        <Skeleton className="m-4 h-64" aria-hidden />
      ) : project.isError ? (
        isMissing(project.error) ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            {t("features.studio.projects.errors.missing")}
          </p>
        ) : (
          <div className="p-4">
            <ErrorSection onRetry={() => void project.refetch()} />
          </div>
        )
      ) : timeline.durationMs === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">
          {t("features.studio.editor.noClips")}
        </p>
      ) : (
        <>
          <EditorStage
            videoRef={player.videoRef}
            words={words}
            template={template}
            timeMs={player.timeMs}
            onToggle={player.toggle}
            label={
              player.playing
                ? t("features.studio.editor.pause")
                : t("features.studio.editor.play")
            }
          />
          {pending && (
            <p
              role="status"
              className="text-muted-foreground flex items-center justify-center gap-2 py-2 text-xs"
            >
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              {t("features.studio.editor.subtitlesPending")}
            </p>
          )}
        </>
      )}
    </StudioScreen>
  );
};
