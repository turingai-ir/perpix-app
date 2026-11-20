import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import { useNavigate, useParams } from "react-router";
import { Check, Loader2, RotateCw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { useAppTranslate } from "@/shared/hooks";
import { useFilesPreviews } from "@/features/file-manager";
import { studioProjectPath } from "@/app/router/routes";
import { VideoExport } from "../export/components/video-export";
import type {
  ExportProject,
  ExportSegment,
} from "../export/model/video-export";
import { StudioScreen } from "../shell/studio-screen";
import { useProject } from "../projects/hooks/use-projects";
import { useTranscripts } from "../projects/hooks/use-transcripts";
import { readClips, VIDEO_TYPES } from "../projects/model/clips";
import { isMissing } from "../projects/model/project-error";
import { CaptionStyleSheet } from "../styles/components/caption-style-sheet";
import { CaptionWordSheet } from "./components/caption-word-sheet";
import {
  applyCaptionMatches,
  findCaptionMatches,
} from "./model/caption-matches";
import { EditTools, type EditAction } from "./components/edit-tools";
import { EditorStage } from "./components/editor-stage";
import { PlayerBar } from "./components/player-bar";
import { TimelineStrip } from "./components/timeline-strip";
import { useAutosave, type SaveState } from "./hooks/use-autosave";
import { useCaptionTemplate } from "./hooks/use-caption-template";
import { useClipDraft } from "./hooks/use-clip-draft";
import { usePlayer } from "./hooks/use-player";
import { useProjectLocalVideos } from "./hooks/use-project-local-videos";
import { useTimelineWords } from "./hooks/use-timeline-words";
import {
  editableCaptionWords,
  readCaptionCorrections,
  updateCaptionCorrection,
  type CaptionCorrections,
  type EditableCaptionWord,
} from "./model/caption-corrections";
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
const NO_CORRECTIONS: CaptionCorrections = {};

const SaveBadge: FC<{ state: SaveState; onRetry: () => void }> = ({
  state,
  onRetry,
}) => {
  const { t } = useAppTranslate();
  if (state === "conflict") {
    return (
      <span
        role="status"
        className="text-destructive text-footnote flex items-center gap-1.5"
      >
        <TriangleAlert className="size-4 shrink-0" aria-hidden />
        {t("features.studio.editor.save.conflict")}
      </span>
    );
  }
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
  const { projectUuid = "" } = useParams();
  return <ProjectEditor key={projectUuid} projectUuid={projectUuid} />;
};

const ProjectEditor: FC<{ projectUuid: string }> = ({ projectUuid }) => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const project = useProject(projectUuid);
  const [corrections, setCorrections] = useState<CaptionCorrections>();
  const [captionEditorOpen, setCaptionEditorOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const { style, setStyle, template } = useCaptionTemplate(
    project.data?.document,
  );
  if (!corrections && project.data) {
    setCorrections(readCaptionCorrections(project.data.document));
  }

  const saved = useMemo(
    () => (project.data ? readClips(project.data.document) : undefined),
    [project.data],
  );
  const { clips: draftClips, commit, undo, canUndo } = useClipDraft(saved);
  const clips = useMemo(() => draftClips ?? [], [draftClips]);
  const draft = useMemo(
    () =>
      draftClips && corrections && style !== undefined
        ? { clips: draftClips, corrections, style }
        : undefined,
    [draftClips, corrections, style],
  );
  const autosave = useAutosave(project.data, draft);

  const timeline = useMemo(() => buildTimeline(clips), [clips]);
  const fileUuids = useMemo(
    () => [...new Set(clips.map((clip) => clip.file_uuid))],
    [clips],
  );

  const galleryFileUuids = useMemo(
    () => [
      ...new Set(
        clips
          .filter((clip) => !clip.local_source)
          .map((clip) => clip.file_uuid),
      ),
    ],
    [clips],
  );
  const localIds = useMemo(
    () =>
      new Map(
        clips.flatMap((clip) =>
          clip.local_source
            ? [[clip.file_uuid, clip.local_source.id] as const]
            : [],
        ),
      ),
    [clips],
  );
  const localVideos = useProjectLocalVideos(projectUuid, clips);
  const relinkInput = useRef<HTMLInputElement>(null);
  const [relinking, setRelinking] = useState(false);
  const { getFilesPreviewsState } = useFilesPreviews(galleryFileUuids);
  const previews = getFilesPreviewsState.data;
  const urlFor = useCallback(
    (fileUuid: string) => {
      const id = localIds.get(fileUuid);
      return id ? localVideos.urls[id] : previews[fileUuid]?.preview_url;
    },
    [localIds, localVideos.urls, previews],
  );

  const transcripts = useTranscripts(fileUuids);
  const { words, pending, transcriptsByFile } = useTimelineWords(
    timeline,
    transcripts.data,
    corrections ?? NO_CORRECTIONS,
  );
  const player = usePlayer(timeline, urlFor);
  const exportSegments = useMemo(() => {
    const segments: ExportSegment[] = [];
    for (const { clip, startMs, endMs } of timeline.segments) {
      const source = clip.local_source
        ? localVideos.files[clip.local_source.id]
        : (previews[clip.file_uuid]?.download_url ??
          previews[clip.file_uuid]?.preview_url);
      if (!source) return null;
      segments.push({ source, startMs, endMs, sourceInMs: clip.source_in_ms });
    }
    return segments;
  }, [timeline.segments, localVideos.files, previews]);
  const exportProject: ExportProject | null = exportSegments
    ? {
        segments: exportSegments,
        words,
        template,
        durationMs: timeline.durationMs,
      }
    : null;

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
      segment,
    };
  }, [timeline, clips, player.timeMs]);

  const activeClip = here?.segment.clip;
  const activeLocalVideo = activeClip?.local_source;
  const missingLocalVideo =
    activeLocalVideo &&
    !localVideos.pending &&
    !localVideos.urls[activeLocalVideo.id];
  const relinkLocalVideo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || !activeLocalVideo || relinking) return;
    setRelinking(true);
    try {
      if (!(await localVideos.relink(activeLocalVideo, file))) {
        toast.error(t("features.studio.localVideo.wrongFile"));
      }
    } catch {
      toast.error(t("features.studio.localVideo.storage"));
    } finally {
      setRelinking(false);
    }
  };
  const transcript = activeClip && transcriptsByFile[activeClip.file_uuid];
  const editableWords = useMemo(
    () =>
      activeClip && transcript
        ? editableCaptionWords(
            transcript,
            activeClip,
            corrections ?? NO_CORRECTIONS,
          )
        : [],
    [activeClip, transcript, corrections],
  );

  const commitCaption = (word: EditableCaptionWord, text: string | null) => {
    if (!here) return;
    setCorrections((current) =>
      updateCaptionCorrection(current ?? NO_CORRECTIONS, word.key, text),
    );
    setCaptionEditorOpen(false);
    player.seek(
      here.segment.startMs + word.sourceMs - here.segment.clip.source_in_ms,
    );
  };

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

  // Keyboard shortcuts, by physical key so they work on a Persian layout too. The handler is
  // kept in a ref that is refreshed after each render, so the listener is added only once.
  const keys = useRef<(event: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keys.current = (event) => {
      if (captionEditorOpen || appearanceOpen) return;
      const target = event.target as HTMLElement | null;
      // Typing, or a focused button or link that Space would press, is left alone; the scrub bar is
      // let keep its own arrow keys but shares the other shortcuts.
      if (
        target?.closest(
          "textarea, select, [contenteditable='true'], input:not([type='range']), button, a",
        )
      )
        return;
      const onScrubBar = target?.matches("input[type='range']") ?? false;
      const byCode: Record<string, EditAction> = {
        KeyS: "split",
        BracketLeft: "trimStart",
        BracketRight: "trimEnd",
        Delete: "remove",
        Backspace: "remove",
      };
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyZ") {
        event.preventDefault();
        if (canUndo) onAction("undo");
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.code === "Space") {
        event.preventDefault();
        player.toggle();
      } else if (
        !onScrubBar &&
        (event.code === "ArrowLeft" || event.code === "ArrowRight")
      ) {
        event.preventDefault();
        const step =
          (event.shiftKey ? 5000 : 1000) *
          (event.code === "ArrowLeft" ? -1 : 1);
        player.seek(player.timeMs + step);
      } else if (event.code === "Home" || event.code === "End") {
        event.preventDefault();
        player.seek(event.code === "Home" ? 0 : timeline.durationMs);
      } else {
        const action = byCode[event.code];
        if (action && !disabled.has(action)) {
          event.preventDefault();
          onAction(action);
        }
      }
    };
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => keys.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

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
          <div className="flex items-center gap-2">
            <SaveBadge
              state={autosave.state}
              onRetry={() => void autosave.flush()}
            />
            {timeline.durationMs > 0 && (
              <VideoExport
                project={exportProject}
                title={project.data?.title ?? "studio"}
                captionsPending={pending || transcripts.isPending}
                loading={
                  localVideos.pending ||
                  (galleryFileUuids.length > 0 &&
                    getFilesPreviewsState.isPending)
                }
                onOpen={player.pause}
              />
            )}
          </div>
        )
      }
      layout="canvas"
      footer={
        timeline.durationMs > 0 && (
          <div className="shrink-0 pb-[max(0rem,env(safe-area-inset-bottom))]">
            <div className="border-t lg:hidden">
              <EditTools layout="row" disabled={disabled} onAction={onAction} />
            </div>
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
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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
              {missingLocalVideo && (
                <div className="gap-group flex flex-wrap items-center justify-center p-2">
                  <p className="text-muted-foreground text-footnote">
                    {t("features.studio.localVideo.missing")}
                  </p>
                  <Button
                    variant="outline"
                    disabled={relinking}
                    onClick={() => relinkInput.current?.click()}
                  >
                    {t("features.studio.localVideo.relink")}
                  </Button>
                  <input
                    ref={relinkInput}
                    type="file"
                    accept={VIDEO_TYPES.join(",")}
                    className="hidden"
                    data-testid="studio-relink-input"
                    onChange={(event) => void relinkLocalVideo(event)}
                  />
                </div>
              )}
              <div className="gap-group flex flex-wrap justify-center pb-2">
                {editableWords.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      player.pause();
                      setCaptionEditorOpen(true);
                    }}
                  >
                    {t("features.studio.editor.corrections.title")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    player.pause();
                    setAppearanceOpen(true);
                  }}
                >
                  {t("features.studio.styles.appearance")}
                </Button>
              </div>
              {appearanceOpen && (
                <CaptionStyleSheet
                  style={style}
                  template={template}
                  onClose={() => setAppearanceOpen(false)}
                  onApply={(next) => {
                    setStyle(next);
                    setAppearanceOpen(false);
                  }}
                />
              )}
              {captionEditorOpen && here && editableWords.length > 0 && (
                <CaptionWordSheet
                  words={editableWords}
                  sourceMs={here.sourceMs}
                  onClose={() => setCaptionEditorOpen(false)}
                  onCommit={commitCaption}
                  onFind={(query) =>
                    findCaptionMatches(
                      timeline,
                      transcriptsByFile,
                      corrections ?? NO_CORRECTIONS,
                      query,
                    )
                  }
                  onApplyMatches={(matches, replacement) => {
                    setCorrections((current) =>
                      applyCaptionMatches(
                        current ?? NO_CORRECTIONS,
                        matches,
                        replacement,
                      ),
                    );
                    setCaptionEditorOpen(false);
                    if (matches[0]) player.seek(matches[0].timelineMs);
                  }}
                />
              )}
              {pending && (
                <p
                  role="status"
                  className="text-muted-foreground flex items-center justify-center gap-2 py-1 text-xs"
                >
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  {t("features.studio.editor.subtitlesPending")}
                </p>
              )}
            </div>
            <aside className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto border-s p-5 lg:flex">
              <h2 className="font-heading text-base font-semibold">
                {t("features.studio.editor.tools.label")}
              </h2>
              <EditTools
                layout="grid"
                disabled={disabled}
                onAction={onAction}
              />
              <p className="text-muted-foreground text-xs leading-6">
                {t("features.studio.editor.tools.hint")}
              </p>
              <dl className="text-muted-foreground grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 text-xs">
                <dt>
                  <kbd
                    dir="ltr"
                    className="bg-muted rounded border px-1.5 py-0.5"
                  >
                    Space
                  </kbd>
                </dt>
                <dd>{t("features.studio.editor.shortcuts.play")}</dd>
                <dt>
                  <kbd
                    dir="ltr"
                    className="bg-muted rounded border px-1.5 py-0.5"
                  >
                    ← →
                  </kbd>
                </dt>
                <dd>{t("features.studio.editor.shortcuts.seek")}</dd>
              </dl>
            </aside>
          </div>
          <TimelineStrip
            timeline={timeline}
            timeMs={player.timeMs}
            onSeek={player.seek}
          />
        </div>
      )}
    </StudioScreen>
  );
};
