import {
  useMemo,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Download,
  FileAudio,
  FileVideo,
  Image as ImageIcon,
  Images,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading2, Muted } from "@/components/ui/typography";
import {
  FILE_MANAGER_ALLOWED_CONTENT_TYPES,
  useFilePreview,
  useInfiniteUserFiles,
  type FileManagerAllowedContentType,
  type UserFileItem,
} from "@/feature/file-manager";
import { formatFileSize } from "@/feature/media-uploader/utils";
import { useAppTranslate } from "@/hook";
import { useInfiniteScroll } from "@/hooks/use-infinitive-scroll";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";
import { downloadFile } from "@/utils";

type GalleryFilter = "all" | "image" | "video" | "audio";
type GalleryMediaType = Exclude<GalleryFilter, "all">;
type GalleryFile = UserFileItem & { uuid: string };

const galleryContentTypes: Record<
  GalleryFilter,
  readonly FileManagerAllowedContentType[]
> = {
  all: FILE_MANAGER_ALLOWED_CONTENT_TYPES,
  image: ["image/jpeg", "image/png"],
  video: ["video/mp4"],
  audio: ["audio/mp3", "audio/mpeg", "audio/wav", "audio/wave", "audio/x-wav"],
};

const GalleryPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const userFilesState = useInfiniteUserFiles({
    contentTypes: galleryContentTypes[activeFilter],
    limit: 50,
  }).getUserFilesState;

  const files = useMemo(
    () => getGalleryFiles(userFilesState.data?.pages),
    [userFilesState.data?.pages],
  );

  const fetchMoreFiles = () => {
    if (
      userFilesState.hasNextPage &&
      !userFilesState.isFetchingNextPage &&
      !userFilesState.isPending &&
      !userFilesState.isError
    ) {
      userFilesState.fetchNextPage();
    }
  };

  const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
    offset: 600,
    disabled: !userFilesState.hasNextPage || userFilesState.isError,
    loading: userFilesState.isPending || userFilesState.isFetchingNextPage,
    onTrigger: fetchMoreFiles,
  });

  const filters: { key: GalleryFilter; label: string }[] = [
    { key: "all", label: t("pages.gallery.filters.all") },
    { key: "image", label: t("pages.gallery.filters.image") },
    { key: "video", label: t("pages.gallery.filters.video") },
    { key: "audio", label: t("pages.gallery.filters.audio") },
  ];

  return (
    <div className="flex min-h-full w-full flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading2 className="text-start text-2xl">
            {t("pages.gallery.title")}
          </Heading2>
          <Muted>{t("pages.gallery.description")}</Muted>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={userFilesState.isFetching}
          onClick={() => userFilesState.refetch()}
        >
          <RefreshCw
            className={cn(userFilesState.isFetching && "animate-spin")}
          />
          {t("pages.gallery.actions.refresh")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            type="button"
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {userFilesState.isPending && files.length === 0 ? (
        <GallerySkeleton />
      ) : userFilesState.isError ? (
        <GalleryState
          icon={<AlertCircle className="h-8 w-8" />}
          title={t("pages.gallery.error.title")}
          description={t("pages.gallery.error.description")}
        />
      ) : files.length === 0 ? (
        <GalleryState
          icon={<Images className="h-8 w-8" />}
          title={t("pages.gallery.empty.title")}
          description={t("pages.gallery.empty.description")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {files.map((file, index) => (
              <GalleryFileCard key={file.uuid} file={file} index={index} />
            ))}
          </div>

          {userFilesState.hasNextPage || userFilesState.isFetchingNextPage ? (
            <div
              ref={loadMoreRef}
              className="text-muted-foreground flex min-h-16 items-center justify-center text-sm"
            >
              {userFilesState.isFetchingNextPage
                ? t("pages.gallery.loadingMore")
                : ""}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const GalleryFileCard: FC<{ file: GalleryFile; index: number }> = ({
  file,
  index,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [isDownloading, setIsDownloading] = useState(false);
  const { getFilePreviewState } = useFilePreview(file.uuid);
  const previewUrl = getFilePreviewState.data?.preview_url;
  const downloadUrl = getFilePreviewState.data?.download_url;
  const isPreviewLoading = getFilePreviewState.isPending;
  const isPreviewError = getFilePreviewState.isError;
  const fileName = file.file_name || t("common.emptyTitle");
  const mediaType = getGalleryMediaType(file.content_type);
  const mediaLabel = t(`pages.gallery.mediaTypes.${mediaType}`);
  const fileSize = formatFileSize(file.file_size);

  const handleDownload = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || isDownloading) return;
    event.preventDefault();

    try {
      setIsDownloading(true);
      downloadFile(downloadUrl);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <div className="bg-background group flex min-w-0 flex-col overflow-hidden rounded-lg border">
        <div className="bg-muted relative aspect-square w-full overflow-hidden">
          {!isPreviewError && previewUrl ? (
            <DialogTrigger asChild>
              <button
                type="button"
                className="focus-visible:ring-ring/50 h-full w-full cursor-zoom-in overflow-hidden outline-none focus-visible:ring-3"
                aria-label={fileName}
              >
                <GalleryPreview
                  mediaType={mediaType}
                  previewUrl={previewUrl}
                  fileName={fileName}
                />
              </button>
            </DialogTrigger>
          ) : null}

          {isPreviewLoading && !previewUrl ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : null}

          {isPreviewError || (!isPreviewLoading && !previewUrl) ? (
            <GalleryFallback mediaType={mediaType} />
          ) : null}
        </div>

        <div className="flex min-w-0 items-start gap-2 p-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">{fileName}</div>
            <div className="text-muted-foreground truncate text-[10px]">
              {mediaLabel}
              {fileSize ? ` · ${fileSize}` : ""}
            </div>
          </div>
          <Button
            asChild
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
          >
            <a
              href={downloadUrl ?? "#"}
              download
              aria-disabled={!downloadUrl || isDownloading}
              className={cn(
                (!downloadUrl || isDownloading) &&
                  "pointer-events-none opacity-50",
              )}
              onClick={handleDownload}
            >
              <Download />
              <span className="sr-only">{t("common.download")}</span>
            </a>
          </Button>
        </div>
      </div>

      <DialogContent
        className="bg-background/95 inset-s-0 top-0 flex h-dvh max-h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 p-3 ring-0 sm:max-w-none rtl:translate-x-0"
        showCloseButton
      >
        <DialogTitle className="sr-only">{fileName}</DialogTitle>
        <DialogDescription className="sr-only">{mediaLabel}</DialogDescription>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          {mediaType === "image" && previewUrl ? (
            <img
              className="max-h-full max-w-full rounded-lg object-contain"
              src={previewUrl}
              alt={`gallery-${index}`}
            />
          ) : null}
          {mediaType === "video" && previewUrl ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className="max-h-full max-w-full rounded-lg"
              src={previewUrl}
              controls
              autoPlay
            />
          ) : null}
          {mediaType === "audio" && previewUrl ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio
              className="w-full max-w-xl"
              src={previewUrl}
              controls
              autoPlay
            />
          ) : null}
        </div>

        <div className="flex w-full shrink-0 items-center justify-center pb-2">
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="h-11 px-5 text-base"
          >
            <a
              href={downloadUrl ?? "#"}
              download
              aria-disabled={!downloadUrl || isDownloading}
              className={cn(
                (!downloadUrl || isDownloading) &&
                  "pointer-events-none opacity-50",
              )}
              onClick={handleDownload}
            >
              <Download />
              {t("common.download")}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GalleryPreview: FC<{
  fileName: string;
  mediaType: GalleryMediaType;
  previewUrl: string;
}> = ({ fileName, mediaType, previewUrl }) => {
  if (mediaType === "image") {
    return (
      <img
        className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        src={previewUrl}
        alt={fileName}
      />
    );
  }

  if (mediaType === "video") {
    return (
      <>
        <video
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          src={previewUrl}
          preload="metadata"
          muted
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
          <FileVideo className="h-8 w-8 drop-shadow" />
        </span>
      </>
    );
  }

  return <GalleryFallback mediaType={mediaType} />;
};

const GalleryFallback: FC<{ mediaType: GalleryMediaType }> = ({
  mediaType,
}) => {
  const Icon =
    mediaType === "video"
      ? FileVideo
      : mediaType === "audio"
        ? FileAudio
        : ImageIcon;

  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center">
      <Icon className="h-9 w-9 opacity-60" />
    </div>
  );
};

const GallerySkeleton = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <Skeleton key={index} className="aspect-square rounded-lg" />
    ))}
  </div>
);

const GalleryState: FC<{
  description: string;
  icon: ReactNode;
  title: string;
}> = ({ description, icon, title }) => (
  <div className="text-muted-foreground flex min-h-80 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
    {icon}
    <div className="text-foreground text-sm font-medium">{title}</div>
    <Muted className="max-w-md">{description}</Muted>
  </div>
);

function getGalleryMediaType(contentType: string): GalleryMediaType {
  if (contentType.startsWith("video/")) return "video";
  if (contentType.startsWith("audio/")) return "audio";
  return "image";
}

function getGalleryFiles(pages: unknown): GalleryFile[] {
  if (!Array.isArray(pages)) return [];

  return pages.flatMap((page) => {
    if (!page || typeof page !== "object") return [];

    const files = (page as { files?: unknown }).files;
    if (!Array.isArray(files)) return [];

    return files.filter(
      (file): file is GalleryFile =>
        typeof file === "object" &&
        file !== null &&
        typeof (file as { uuid?: unknown }).uuid === "string",
    );
  });
}

export default GalleryPage;
