import { useMemo, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Images, Loader2, Film, Play } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { useAppTranslate } from "@/shared/hooks";
import { FileManagerUploadStatus } from "@/features/file-manager";
import { APP_ROUTES_KEY, studioEditPath } from "@/app/router/routes";
import { StudioScreen } from "../shell/studio-screen";
import { ClipCard } from "./components/clip-card";
import { TranscriptLanguageSheet } from "./components/transcript-language-sheet";
import { GalleryPickerSheet } from "./components/gallery-picker-sheet";
import { useAddClip } from "./hooks/use-add-clip";
import { useRemoveClip } from "./hooks/use-remove-clip";
import { useProject } from "./hooks/use-projects";
import {
  usePendingTranscriptFiles,
  useRequestTranscript,
  useTranscripts,
} from "./hooks/use-transcripts";
import { readClips } from "./model/clips";
import { isMissing } from "./model/project-error";

/** A project's screen: its videos in order, each with the state of its subtitles. */
export const ProjectPage: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { projectUuid = "" } = useParams();
  const project = useProject(projectUuid);
  const {
    addFromGallery,
    addLocalVideo,
    busy,
    preparingLocal,
    pendingUploads,
  } = useAddClip(projectUuid);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [languageTarget, setLanguageTarget] = useState<{
    fileUuid: string;
    replaceUuid?: string;
  }>();

  const removeClip = useRemoveClip(projectUuid);
  const requestTranscript = useRequestTranscript();
  const pendingTranscriptFiles = usePendingTranscriptFiles();

  const clips = useMemo(
    () => (project.data ? readClips(project.data.document) : []),
    [project.data],
  );
  const transcripts = useTranscripts([
    ...new Set(clips.map((clip) => clip.file_uuid)),
  ]);
  const back = () => navigate(APP_ROUTES_KEY.studio.path, { replace: true });

  const used = useMemo(
    () =>
      new Set(
        clips
          .filter((clip) => !clip.local_source)
          .map((clip) => clip.file_uuid),
      ),
    [clips],
  );

  const uploading = [...pendingUploads.values()].filter(
    (item) => item.status === FileManagerUploadStatus.UPLOADING,
  );

  return (
    <StudioScreen
      title={project.data?.title ?? t("features.studio.projects.title")}
      onBack={back}
      width="narrow"
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
          <div className="shrink-0 border-t px-4 py-3 lg:hidden">
            <Button
              size="lg"
              className="min-h-12 w-full gap-2 text-base"
              disabled={busy}
              onClick={() => setPickerOpen(true)}
            >
              {busy ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <Images className="size-5" aria-hidden />
              )}
              {t("features.studio.clips.add")}
            </Button>
          </div>
        )
      }
    >
      {project.isPending ? (
        <Skeleton className="h-20 w-full" aria-hidden />
      ) : project.isError ? (
        isMissing(project.error) ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t("features.studio.projects.errors.missing")}
          </p>
        ) : (
          <ErrorSection onRetry={() => void project.refetch()} />
        )
      ) : clips.length === 0 && uploading.length === 0 ? (
        <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center">
          <Film className="size-12 text-muted-foreground" aria-hidden />
          <p className="max-w-64 text-sm text-muted-foreground">
            {t("features.studio.clips.empty")}
          </p>
          <p className="max-w-64 text-xs text-muted-foreground">
            {t("features.studio.clips.limits")}
          </p>
          <Button
            size="lg"
            className="mt-2 hidden min-h-12 gap-2 px-6 lg:inline-flex"
            disabled={busy}
            onClick={() => setPickerOpen(true)}
          >
            <Images className="size-5" aria-hidden />
            {t("features.studio.clips.add")}
          </Button>
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
              requesting={pendingTranscriptFiles.includes(clip.file_uuid)}
              loadingStatus={transcripts.isPending}
              onReloadStatus={
                transcripts.isError
                  ? () => void transcripts.refetch()
                  : undefined
              }
              onRetry={(item) =>
                requestTranscript.mutate({ file_uuid: item.file_uuid })
              }
              onChooseLanguage={(replaceUuid) =>
                setLanguageTarget({ fileUuid: clip.file_uuid, replaceUuid })
              }
              onRemove={(item) => removeClip.mutate(item.id)}
            />
          ))}
          <li className="hidden lg:block">
            <Button
              variant="outline"
              className="min-h-14 w-full gap-2 border-dashed"
              disabled={busy}
              onClick={() => setPickerOpen(true)}
            >
              {busy ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <Images className="size-5" aria-hidden />
              )}
              {t("features.studio.clips.add")}
            </Button>
          </li>
          {uploading.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-sm text-muted-foreground"
            >
              <Loader2 className="size-5 animate-spin" aria-hidden />
              <span className="truncate">
                {t("features.studio.clips.uploading", { name: item.name })}
              </span>
            </li>
          ))}
        </ul>
      )}
      {preparingLocal && uploading.length === 0 && (
        <p
          role="status"
          className="mt-3 text-center text-sm text-muted-foreground"
        >
          {t("features.studio.localVideo.preparing")}
        </p>
      )}
      {languageTarget && (
        <TranscriptLanguageSheet
          replacing={!!languageTarget.replaceUuid}
          onClose={() => setLanguageTarget(undefined)}
          onSubmit={(language) => {
            requestTranscript.mutate({
              file_uuid: languageTarget.fileUuid,
              language,
              replace_transcript_uuid: languageTarget.replaceUuid,
            });
            setLanguageTarget(undefined);
          }}
        />
      )}
      <GalleryPickerSheet
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        usedFileUuids={used}
        busy={busy}
        uploads={pendingUploads}
        onPick={(video, language) => void addFromGallery(video, language)}
        onUpload={(file, language) => void addLocalVideo(file, language)}
      />
    </StudioScreen>
  );
};
