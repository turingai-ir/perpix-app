import { useCallback, useEffect, useMemo, useRef, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Check, Loader2, RotateCw } from "lucide-react";

import { Button } from "@/shared/ui/button";
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
import { EditTools, type EditAction } from "./components/edit-tools";
import { EditorStage } from "./components/editor-stage";
import { PlayerBar } from "./components/player-bar";
import { TimelineStrip } from "./components/timeline-strip";
import { useAutosave, type SaveState } from "./hooks/use-autosave";
import { useCaptionTemplate } from "./hooks/use-caption-template";
import { useClipDraft } from "./hooks/use-clip-draft";
import { usePlayer } from "./hooks/use-player";
import { useTimelineWords } from "./hooks/use-timeline-words";
import {
  moveBy,
  removeAt,
  splitAt,
  trimEnd,
  trimStart,
  type Edit,
} from "./model/edit";
import { buildTimeline, locate } from "./model/timeline";

type Focus = { time: number } | { index: number; offset: number };

const SaveBadge: FC<{ state: SaveState; onRetry: () => void }> = ({
  state,
  onRetry,
}) => {
  const { t } = useAppTranslate();
  if (state === "failed") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive min-h-11 gap-1.5"
        onClick={onRetry}
      >
        <RotateCw className="size-4" aria-hidden />
        {t("features.studio.editor.save.failed")}
      </Button>
    );
  }
  return (
    <span
      role="status"
      className="text-muted-foreground flex min-h-11 items-center gap-1.5 px-2 text-xs"
    >
      {state === "saved" ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      )}
      {state === "saved"
        ? t("features.studio.editor.save.saved")
        : t("features.studio.editor.save.saving")}
    </span>
  );
};

/** The editor: the project's clips played in order with the captions on top, cut and joined by hand. */
export const EditorPage: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { projectUuid = "" } = useParams();
  const project = useProject(projectUuid);

  const saved = useMemo(
    () => (project.data ? readClips(project.data.document) : undefined),
    [project.data],
  );
  const { clips: draftClips, commit, undo, canUndo } = useClipDraft(saved);
  const clips = useMemo(() => draftClips ?? [], [draftClips]);
  const autosave = useAutosave(projectUuid, draftClips);

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

  // After an edit the playhead moves to where the edit says, once the new timeline exists.
  const focus = useRef<Focus | null>(null);
  const { seek } = player;
  useEffect(() => {
    const wanted = focus.current;
    focus.current = null;
    if (!wanted) return;
    if ("time" in wanted) seek(wanted.time);
    else {
      const segment = timeline.segments[wanted.index];
      if (segment) seek(segment.startMs + wanted.offset);
    }
  }, [timeline, seek]);

  /** The clip under the playhead and how far into its source the playhead is. */
  const here = useMemo(() => {
    const spot = locate(timeline, player.timeMs);
    const segment = spot && timeline.segments[spot.index];
    if (!spot || !segment) return null;
    return {
      index: clips.findIndex((clip) => clip.id === segment.clip.id),
      sourceMs: spot.sourceMs,
      offsetMs: spot.sourceMs - segment.clip.source_in_ms,
    };
  }, [timeline, clips, player.timeMs]);

  const plan = (action: Exclude<EditAction, "undo">): Edit | null => {
    if (!here) return null;
    switch (action) {
      case "split":
        return splitAt(clips, here.index, here.sourceMs);
      case "trimStart":
        return trimStart(clips, here.index, here.sourceMs);
      case "trimEnd":
        return trimEnd(clips, here.index, here.sourceMs);
      case "remove":
        return removeAt(clips, here.index);
      case "earlier":
        return moveBy(clips, here.index, -1, here.offsetMs);
      case "later":
        return moveBy(clips, here.index, 1, here.offsetMs);
    }
  };

  const disabled = new Set<EditAction>();
  (["split", "trimStart", "trimEnd", "remove", "earlier", "later"] as const)
    .filter((action) => plan(action) === null)
    .forEach((action) => disabled.add(action));
  if (!canUndo) disabled.add("undo");

  const onAction = (action: EditAction) => {
    player.pause();
    if (action === "undo") {
      focus.current = { time: player.timeMs };
      undo();
      return;
    }
    const edit = plan(action);
    if (!edit) return;
    focus.current = { index: edit.focusIndex, offset: edit.focusOffsetMs };
    commit(edit.clips);
  };

  const back = async () => {
    player.pause();
    if (await autosave.flush()) {
      navigate(studioProjectPath(projectUuid), { replace: true });
    }
  };

  return (
    <StudioScreen
      title={project.data?.title ?? t("features.studio.projects.title")}
      onBack={() => void back()}
      actions={
        draftClips && (
          <SaveBadge
            state={autosave.state}
            onRetry={() => void autosave.flush()}
          />
        )
      }
      className="flex flex-col overflow-hidden p-0"
      footer={
        timeline.durationMs > 0 && (
          <div className="shrink-0 border-t pb-[max(0rem,env(safe-area-inset-bottom))]">
            <EditTools disabled={disabled} onAction={onAction} />
            <PlayerBar
              timeMs={player.timeMs}
              durationMs={timeline.durationMs}
              playing={player.playing}
              onToggle={player.toggle}
              onSeek={player.seek}
            />
          </div>
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
              className="text-muted-foreground flex items-center justify-center gap-2 py-1 text-xs"
            >
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              {t("features.studio.editor.subtitlesPending")}
            </p>
          )}
          <TimelineStrip
            timeline={timeline}
            timeMs={player.timeMs}
            onSeek={player.seek}
          />
        </>
      )}
    </StudioScreen>
  );
};
