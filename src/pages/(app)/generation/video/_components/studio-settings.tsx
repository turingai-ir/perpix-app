import { SlidersHorizontal } from "lucide-react";

import styles from "../studio.module.css";
import { useAppTranslate } from "@/hooks";
import { DynamicPromptConfigField } from "@/pages/(app)/generation/_components/dynamic-config";
import { PromptModelSelector } from "@/pages/(app)/generation/_components/prompt-box/model-selector";
import type { useGenerationPromptBox } from "@/pages/(app)/generation/_hooks";

export function VideoStudioSettings({
  studio,
  section,
}: {
  studio: ReturnType<typeof useGenerationPromptBox>;
  section: "model" | "config";
}) {
  const { t } = useAppTranslate();
  const { model, dynamicForm, isFormBusy } = studio;
  if (section === "model")
    return (
      <section className={styles.model} aria-label={t("common.chooseModel")}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionNumber} aria-hidden="true">
            01
          </span>
          <div>
            <h2>{t("pages.generation.video.studio.model")}</h2>
            <p>{t("pages.generation.video.studio.modelHint")}</p>
          </div>
        </div>
        <PromptModelSelector
          model={model}
          disabled={isFormBusy}
          chooseModelLabel={t("common.chooseModel")}
          upgradeLabel={t("common.upgradeRequired")}
        />
      </section>
    );
  return (
    <div className={styles.settings}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionNumber} aria-hidden="true">
          02
        </span>
        <div>
          <h2>{t("pages.generation.video.studio.settings")}</h2>
          <p>{t("pages.generation.video.studio.settingsHint")}</p>
        </div>
      </div>
      <div className={styles.configGrid}>
        {studio.promptBoxConfigFieldNames.map((fieldName) => (
          <DynamicPromptConfigField
            key={fieldName}
            dynamicForm={dynamicForm}
            fieldName={fieldName}
            disabled={isFormBusy}
            layout="stacked"
          />
        ))}
      </div>
      {studio.advancedFieldNames.length > 0 && (
        <section className={styles.advanced}>
          <h3>
            <SlidersHorizontal size={15} aria-hidden="true" />
            {t("pages.generation.video.studio.advanced")}
          </h3>
          <div className={styles.configGrid}>
            {studio.advancedFieldNames.map((fieldName) => (
              <DynamicPromptConfigField
                key={fieldName}
                dynamicForm={dynamicForm}
                fieldName={fieldName}
                disabled={isFormBusy}
                layout="stacked"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
