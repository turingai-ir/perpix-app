import type { FC } from "react";
import {
  EditorPageLoadError,
  EditorPageLoading,
} from "./editor-page-state";
import { EditorUploaderEmpty } from "./editor-uploader-empty";
import { ImageEditor } from "./image-editor";
import { useEditorPage } from "../hooks/use-editor-page";

export const EditorPageView: FC = () => {
  const {
    fileUuid,
    imageSource,
    isLoading,
    isError,
    handleFileSelect,
    handleBack,
  } = useEditorPage();

  if (isLoading) {
    return <EditorPageLoading />;
  }

  if (isError) {
    return <EditorPageLoadError onBack={handleBack} />;
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col">
      {imageSource ? (
        <div className="relative h-full w-full flex-1">
          <ImageEditor
            documentId={fileUuid}
            src={imageSource}
            onBack={handleBack}
          />
        </div>
      ) : (
        <EditorUploaderEmpty onFileSelect={handleFileSelect} />
      )}
    </div>
  );
};

export default EditorPageView;
