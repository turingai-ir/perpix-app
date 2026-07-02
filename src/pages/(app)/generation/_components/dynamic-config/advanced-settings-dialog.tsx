import type { FC } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";

import { DynamicPromptConfigField } from "./dynamic-config-field";
import type { DynamicConfigForm } from "./types";

export const AdvancedPromptSettingsDialog: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  fieldNames: readonly string[];
}> = ({ disabled, dynamicForm, fieldNames }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  if (fieldNames.length === 0) return null;

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
          {t("common.advancedSettings")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(640px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-[480px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("common.advancedSettings")}</DialogTitle>
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
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
