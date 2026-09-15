import { useEffect } from "react";
import { ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAppTranslate } from "@/hooks";
import { DynamicPromptConfigField } from "./dynamic-config-field";
import { SettingHelpPopover } from "./setting-help-popover";
import type { DynamicConfigForm } from "./types";
import type { useImageSettings } from "./use-image-settings";
import styles from "./image-settings.module.css";

export function ImageSettingsFields({
  dynamicForm,
  settings,
  disabled,
  professionalOpen,
  onProfessionalOpenChange,
}: {
  dynamicForm: DynamicConfigForm;
  settings: ReturnType<typeof useImageSettings>;
  disabled?: boolean;
  professionalOpen: boolean;
  onProfessionalOpenChange: (open: boolean) => void;
}) {
  const { t } = useAppTranslate();
  const firstProfessionalError = settings.professional.find(
    (name) => settings.errors[name],
  );
  useEffect(() => {
    if (firstProfessionalError) {
      dynamicForm.form.setFocus(firstProfessionalError);
    }
  }, [firstProfessionalError, dynamicForm.form]);
  const renderFields = (names: readonly string[], professional = false) =>
    names.map((name) => {
      const meta = dynamicForm.getFieldMeta(name);
      const label = t(`pages.generation.image.studio.fields.${name}`, {
        defaultValue: meta?.title ?? name,
      });
      const hint = t(`pages.generation.image.studio.hints.${name}`, {
        defaultValue: meta?.hint ?? "",
      });
      return (
        <div key={name} className={styles.field}>
          {(settings.changed.includes(name) || (professional && hint)) && (
            <div className={styles.fieldTools}>
              {settings.changed.includes(name) && (
                <span className={styles.changed}>
                  {t("pages.generation.image.studio.settings.changed")}
                </span>
              )}
              {professional && hint && (
                <SettingHelpPopover label={label} hint={hint} />
              )}
            </div>
          )}
          <DynamicPromptConfigField
            dynamicForm={dynamicForm}
            fieldName={name}
            disabled={disabled}
            layout="stacked"
            simple
            compact={professional}
          />
        </div>
      );
    });

  return (
    <div className={styles.fields}>
      {settings.basic.length > 0 && (
        <section aria-label={t("pages.generation.image.studio.settings.basic")}>
          <h3 className={styles.sectionTitle}>
            <Sparkles aria-hidden="true" />
            {t("pages.generation.image.studio.settings.basic")}
          </h3>
          <div className={styles.fieldList}>{renderFields(settings.basic)}</div>
        </section>
      )}
      {settings.professional.length > 0 && (
        <Collapsible
          open={professionalOpen || Boolean(firstProfessionalError)}
          onOpenChange={onProfessionalOpenChange}
          className={styles.professional}
        >
          <CollapsibleTrigger className={styles.disclosure}>
            <SlidersHorizontal aria-hidden="true" />
            <span>
              {t("pages.generation.image.studio.settings.professional")}
            </span>
            <ChevronDown aria-hidden="true" className={styles.chevron} />
          </CollapsibleTrigger>
          <p className={styles.professionalHint}>
            {t("pages.generation.image.studio.settings.professionalHint")}
          </p>
          <CollapsibleContent>
            <div className={styles.fieldList}>
              {renderFields(settings.professional, true)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
