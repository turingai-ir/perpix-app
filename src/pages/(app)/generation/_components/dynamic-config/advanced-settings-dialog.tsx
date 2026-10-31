import type { FC } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import { DynamicPromptConfigField } from "./dynamic-config-field";
import { ImageSettingsDialog } from "./image-settings-dialog";
import type { DynamicConfigForm } from "./types";

export const AdvancedPromptSettingsDialog: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldNames: readonly string[];
  label?: string;
  simple?: boolean;
  modelName?: string;
}> = ({ disabled, dynamicForm, fieldNames, label, simple, modelName }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  if (fieldNames.length === 0) return null;

  if (simple)
    return (
      <ImageSettingsDialog
        disabled={disabled}
        dynamicForm={dynamicForm}
        fieldNames={fieldNames}
        modelName={modelName}
      />
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          disabled={disabled}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {label ?? t("common.advancedSettings")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(640px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-[480px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{label ?? t("common.advancedSettings")}</DialogTitle>
          {simple && (
            <DialogDescription>
              {t("pages.generation.image.studio.settingsHelp")}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="min-h-0 w-full pe-2">
          <div className="flex w-full flex-col gap-3">
            {fieldNames.map((fieldName) => (
              <DynamicPromptConfigField
                key={fieldName}
                dynamicForm={dynamicForm}
                fieldName={fieldName}
                disabled={disabled}
                layout="stacked"
                simple={simple}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
