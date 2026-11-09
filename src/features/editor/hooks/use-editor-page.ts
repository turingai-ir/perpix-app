import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import { useFilePreview } from "@/features/file-manager";
import { useEditorImageSource } from "./use-editor-image-source";

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export function useEditorPage() {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { fileUuid } = useParams<{ fileUuid?: string }>();

  const { getFilePreviewState } = useFilePreview(fileUuid, !!fileUuid);

  const editorImageUrl =
    getFilePreviewState.data?.download_url ??
    getFilePreviewState.data?.preview_url;

  const {
    imageSource,
    remoteImageLoading,
    setLocalImageFile,
    clearImageSource,
  } = useEditorImageSource(editorImageUrl);

  const handleFileSelect = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(t("pages.editor.uploaderError"));
      return;
    }
    setLocalImageFile(file);
  };

  const handleBack = () => {
    clearImageSource();
    navigate("/editor");
  };

  const isLoading = Boolean(
    fileUuid && (getFilePreviewState.isPending || remoteImageLoading),
  );
  const isError = Boolean(fileUuid && getFilePreviewState.isError);

  return {
    fileUuid,
    imageSource,
    isLoading,
    isError,
    handleFileSelect,
    handleBack,
  };
}
