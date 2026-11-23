import { useState } from "react";
import type { SchemaStudioTranscriptLanguage } from "@/shared/api";
import { useAppTranslate } from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { BottomSheet } from "../../ui/bottom-sheet";

import { SPEECH_LANGUAGES } from "../model/transcript";

export function TranscriptLanguageSheet({
  replacing,
  onClose,
  onSubmit,
}: {
  replacing: boolean;
  onClose: () => void;
  onSubmit: (language: SchemaStudioTranscriptLanguage) => void;
}) {
  const { t } = useAppTranslate();
  const [language, setLanguage] =
    useState<SchemaStudioTranscriptLanguage>("auto");
  return (
    <BottomSheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t("features.studio.clips.language.title")}
      description={t("features.studio.clips.language.description")}
    >
      <fieldset className="flex flex-col gap-group">
        <legend className="sr-only">
          {t("features.studio.clips.language.title")}
        </legend>
        {SPEECH_LANGUAGES.map((value) => (
          <label
            key={value}
            htmlFor={`studio-language-${value}`}
            className="flex items-center gap-3 rounded-control border p-3 text-body"
          >
            <input
              id={`studio-language-${value}`}
              name="studio-language"
              type="radio"
              checked={value === language}
              onChange={() => setLanguage(value)}
            />
            {t(`features.studio.clips.language.${value}`)}
          </label>
        ))}
        <Button onClick={() => onSubmit(language)}>
          {t(
            replacing
              ? "features.studio.clips.language.rebuild"
              : "features.studio.clips.subtitle.request",
          )}
        </Button>
      </fieldset>
    </BottomSheet>
  );
}
