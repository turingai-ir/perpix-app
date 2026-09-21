import { Camera, Clapperboard, Package, RotateCcw, Sprout } from "lucide-react";

import styles from "../studio.module.css";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import { PromptTextarea } from "@/pages/(app)/generation/_components/prompt-box/prompt-textarea";

const starters = [
  { key: "product", icon: Package },
  { key: "story", icon: Clapperboard },
  { key: "nature", icon: Sprout },
] as const;

export function VideoStudioPrompt({
  dynamicForm,
  disabled,
  previousPrompt,
}: {
  dynamicForm: DynamicConfigForm;
  disabled: boolean;
  previousPrompt: unknown;
}) {
  const { t } = useAppTranslate();
  const hasPrompt = String(dynamicForm.watch("prompt") ?? "").trim().length > 0;
  const applyPrompt = (prompt: string) => {
    if (disabled || hasPrompt) return;
    dynamicForm.setValue("prompt", prompt, {
      shouldDirty: true,
      shouldValidate: true,
    });
    dynamicForm.form.setFocus("prompt");
  };
  return (
    <section className={styles.prompt}>
      <PromptTextarea
        dynamicForm={dynamicForm}
        disabled={disabled}
        label={t("pages.generation.video.studio.promptLabel")}
        hint={t("pages.generation.video.studio.promptHint")}
        placeholder={t(
          "pages.generation.video.promptBox.promptTextArea.placeholder",
        )}
      />
      <div className={styles.starterHeader}>
        <span>
          <Camera aria-hidden="true" size={14} />
          {t("pages.generation.video.studio.starters")}
        </span>
        {typeof previousPrompt === "string" && previousPrompt.trim() && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            disabled={disabled || hasPrompt}
            onClick={() => applyPrompt(previousPrompt)}
          >
            <RotateCcw aria-hidden="true" size={14} />
            {t("pages.generation.video.studio.reuse")}
          </Button>
        )}
      </div>
      <div className={styles.starters}>
        {starters.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            disabled={disabled || hasPrompt}
            onClick={() =>
              applyPrompt(
                t(`pages.generation.video.studio.examples.${key}.prompt`),
              )
            }
          >
            <Icon aria-hidden="true" size={16} />
            {t(`pages.generation.video.studio.examples.${key}.label`)}
          </button>
        ))}
      </div>
      <p className={styles.helper}>
        {t(
          hasPrompt
            ? "pages.generation.video.studio.keepPrompt"
            : "pages.generation.video.studio.starterHint",
        )}
      </p>
    </section>
  );
}
