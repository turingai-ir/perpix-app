import React from "react";
import { useNavigate, useParams } from "react-router";
import { ImageEditor } from "./_components/image-editor";
import { EditorUploaderEmpty } from "./_components/editor-uploader-empty";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks/i18/use-app-translate";
import { useFilePreview } from "@/feature/file-manager";
import { useEditorImageSource } from "./_hooks/use-editor-image-source";
import { useEditorSaveActions } from "./_hooks/use-editor-save-actions";
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
    getFilePreviewState.data?.download_url ?? getFilePreviewState.data?.preview_url;
  const {
    imageSource,
    remoteImageLoading,
    setLocalImageFile,
    clearImageSource,
  } = useEditorImageSource(editorImageUrl);
  const { handleSave, handleSaveToGallery } = useEditorSaveActions(fileUuid);

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

  const handleCancelEdit = () => {
    clearImageSource();
    if (fileUuid) navigate("/editor");
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
          <ImageEditor
            src={imageSource}
            onSave={handleSave}
            onSaveToGallery={handleSaveToGallery}
          />
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            className="bg-background/90 absolute top-16 right-4 z-40 h-8 px-3 text-xs font-semibold shadow-sm"
          >
            {t("pages.editor.changeImage")}
          </Button>
        </div>
      ) : (
        <EditorUploaderEmpty onFileChange={handleFileChange} />
      )}
    </div>
  );
}
