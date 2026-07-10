import React from "react";
import { useNavigate, useParams } from "react-router";
import { ImageEditor } from "./_components/image-editor";
import { EditorUploaderEmpty } from "./_components/editor-uploader-empty";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useFilePreview } from "@/feature/file-manager";
import { useEditorImageSource } from "./_hooks/use-editor-image-source";
import {
  EditorPageLoadError,
  EditorPageLoading,
} from "./_components/editor-page-state";

export default function EditorPage() {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { fileUuid } = useParams<{ fileUuid?: string }>();

  const { getFilePreviewState } = useFilePreview(fileUuid, !!fileUuid);

  const editorImageUrl =
    getFilePreviewState.data?.download_url ??
    getFilePreviewState.data?.preview_url;
  const { imageSource, remoteImageLoading, setLocalImageFile } =
    useEditorImageSource(editorImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("pages.editor.uploaderError"));
        return;
      }
      setLocalImageFile(file);
    }
  };

  if (fileUuid && (getFilePreviewState.isPending || remoteImageLoading)) {
    return <EditorPageLoading />;
  }

  if (fileUuid && getFilePreviewState.isError) {
    return <EditorPageLoadError onBack={() => navigate("/editor")} />;
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col">
      {imageSource ? (
        <div className="relative h-full w-full flex-1">
          <ImageEditor documentId={fileUuid} src={imageSource} />
        </div>
      ) : (
        <EditorUploaderEmpty onFileChange={handleFileChange} />
      )}
    </div>
  );
}
