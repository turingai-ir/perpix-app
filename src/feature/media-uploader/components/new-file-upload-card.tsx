import { ClipboardPaste, LoaderCircle, Upload } from "lucide-react";
import type { ChangeEventHandler, FC } from "react";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface NewFileUploadCardProps {
  accept: string;
  disabled: boolean;
  inputId: string;
  isUploading: boolean;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  onPasteClick?: () => void;
}

export const NewFileUploadCard: FC<NewFileUploadCardProps> = ({
  accept,
  disabled,
  inputId,
  isUploading,
  onFileChange,
  onPasteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="bg-muted/40 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <div className="text-foreground text-sm font-medium">
          {t("features.mediaUploader.newFile.title")}
        </div>
        <div className="text-muted-foreground mt-1 text-xs">
          {t("features.mediaUploader.newFile.description")}
          {onPasteClick && (
            <span className="ms-1">
              {t("features.mediaUploader.newFile.pasteHint")}
            </span>
          )}
        </div>
      </div>
      <input
        id={inputId}
        type="file"
        className="hidden"
        accept={accept}
        multiple={false}
        disabled={disabled || isUploading}
        onChange={onFileChange}
      />
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {onPasteClick && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={onPasteClick}
          >
            <ClipboardPaste />
            {t("features.mediaUploader.newFile.paste")}
          </Button>
        )}
        <Button asChild disabled={disabled || isUploading} size="sm">
          <label htmlFor={inputId} className="cursor-pointer">
            {isUploading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Upload />
            )}
            {isUploading
              ? t("common.uploading")
              : t("features.mediaUploader.actions.upload")}
          </label>
        </Button>
      </div>
    </div>
  );
};
