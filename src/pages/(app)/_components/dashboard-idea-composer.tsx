import { ArrowUpLeft, Dices } from "lucide-react";

import {
  creativePresets,
  type CreativeMode,
  type CreativePreset,
} from "./dashboard-creative-presets";
import styles from "../dashboard.module.css";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardIdeaComposerProps {
  mode: CreativeMode;
  onContinue: () => void;
  onPreset: (preset: CreativePreset) => void;
  onPromptChange: (prompt: string) => void;
  onSurprise: () => void;
  prompt: string;
}

export function DashboardIdeaComposer({
  mode,
  onContinue,
  onPreset,
  onPromptChange,
  onSurprise,
  prompt,
}: DashboardIdeaComposerProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div
      id="dashboard-idea-composer"
      className={styles.command}
      data-mode={mode}
    >
      <div className="min-w-0">
        <p className={styles.commandEyebrow}>
          {t("pages.root.dashboard.command.editor.eyebrow")}
        </p>
        <label
          className="mt-1 block text-lg font-semibold text-white"
          htmlFor="dashboard-creative-prompt"
        >
          {t(`pages.root.dashboard.command.editor.${mode}.title`)}
        </label>
        <p className="mt-1 text-xs leading-6 text-zinc-400">
          {t(`pages.root.dashboard.command.editor.${mode}.description`)}
        </p>
      </div>
      <textarea
        id="dashboard-creative-prompt"
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        placeholder={t(
          `pages.root.dashboard.command.editor.${mode}.placeholder`,
        )}
        className={styles.promptInput}
      />
      <div
        className="flex flex-wrap gap-2"
        aria-label={t("pages.root.dashboard.command.presetsLabel")}
      >
        {creativePresets
          .filter((preset) => preset.mode === mode)
          .map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.preset}
              onClick={() => onPreset(preset)}
            >
              <preset.Icon aria-hidden="true" />
              {t(`pages.root.dashboard.command.presets.${preset.id}.label`)}
            </button>
          ))}
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-white/8 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="h-11 min-w-11 self-start text-zinc-300"
          onClick={onSurprise}
        >
          <Dices aria-hidden="true" />
          {t("pages.root.dashboard.command.surprise")}
        </Button>
        <Button
          type="button"
          className={styles.commandAction}
          onClick={onContinue}
        >
          {t(`pages.root.dashboard.command.editor.${mode}.action`)}
          <ArrowUpLeft aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
